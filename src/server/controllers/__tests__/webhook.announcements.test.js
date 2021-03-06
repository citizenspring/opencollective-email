import { db, inspectSpy } from '../../lib/jest';
import webhook from '../webhook';

import sinon from 'sinon';
import libemail from '../../lib/email';
import models from '../../models';

import email1 from '../../mocks/mailgun.email1.json';

const req = { body: email1 };
const res = { send: () => {} };

describe('webhook email', () => {
  let sandbox, sendEmailSpy, user;

  beforeAll(db.reset);
  afterAll(db.close);

  beforeAll(async () => {
    sandbox = sinon.createSandbox();
    sendEmailSpy = sandbox.spy(libemail, 'send');
    user = await models.User.create({ email: 'firstsender@gmail.com' });
  });

  afterAll(() => sandbox.restore());

  describe('announcements only groups', () => {
    let group;
    beforeAll(async () => {
      sendEmailSpy.resetHistory();
      group = await models.Group.create({
        slug: 'testgroup',
        UserId: user.id,
        settings: { type: 'announcements' },
      });
    });
    beforeEach(() => {
      sendEmailSpy.resetHistory();
    });
    it('fails to send a new thread if sender is not an admin', async () => {
      await webhook(req, res);
      expect(sendEmailSpy.firstCall.args[0]).toEqual(email1.sender);
      expect(sendEmailSpy.firstCall.args[1]).toEqual('Cannot send email to group (must be an admin)');
    });
    it('successfully creates a new thread if sender is an admin', async () => {
      await group.addMembers([{ email: email1.sender }], { role: 'ADMIN' });
      req.body['Message-Id'] = `${Math.round(Math.random() * 10000000)}`;
      await webhook(req, res);
      expect(sendEmailSpy.firstCall.args[0]).toEqual(email1.sender);
      expect(sendEmailSpy.firstCall.args[1]).toContain('Message sent to the testgroup group');
    });
  });
});
