import { db, inspectSpy } from '../../lib/jest';
import webhook from '../webhook';

import sinon from 'sinon';
import libemail from '../../lib/email';
import models from '../../models';

import email1 from '../../mocks/mailgun.email1.json';
import * as api from '../../controllers/api';

describe('webhook email', () => {
  let sandbox, sendEmailSpy, sendTemplateSpy;

  beforeAll(db.reset);
  afterAll(db.close);

  beforeAll(() => {
    sandbox = sinon.createSandbox();
    sendEmailSpy = sandbox.spy(libemail, 'send');
    sendTemplateSpy = sandbox.spy(libemail, 'sendTemplate');
  });

  afterAll(() => sandbox.restore());

  describe('sending first email in a thread', async () => {
    describe('email is empty', () => {
      beforeAll(async () => {
        sendEmailSpy.resetHistory();
        const req = { body: { ...email1, 'stripped-text': '', 'stripped-html': '' } };
        const res = { send: () => {} };
        await webhook(req, res);
      });
      it('sends the join group email', async () => {
        const post = await models.Post.findOne();
        expect(post).toBeNull();
        expect(sendEmailSpy.callCount).toEqual(1);
        expect(sendEmailSpy.firstCall.args[1]).toEqual('Action required: please confirm to join the testgroup group');
      });
    });

    describe('email is not empty', () => {
      beforeAll(async () => {
        sendEmailSpy.resetHistory();
        const req = { body: email1 };
        req.body['Message-Id'] = `${Math.round(Math.random() * 10000000)}`;
        const res = { send: () => {} };
        await webhook(req, res);
      });

      it('send an email confirmation if first time user', async () => {
        expect(sendEmailSpy.callCount).toEqual(1);
        expect(sendEmailSpy.firstCall.args[0]).toEqual(email1.sender.toLowerCase());
        expect(sendEmailSpy.firstCall.args[1]).toEqual('Action required: your email is pending');
      });

      it("doesn't create any user account", async () => {
        const users = await models.User.findAll();
        expect(users.length).toEqual(0);
      });

      it("doesn't create any group", async () => {
        const groups = await models.Group.findAll();
        expect(groups.length).toEqual(0);
      });

      it('creates the group and post the mail after confirming', async () => {
        const data = sendTemplateSpy.firstCall.args[1];
        const { groupSlug, confirmationUrl } = data;
        expect(groupSlug).toEqual('testgroup');
        const token = confirmationUrl.substr(confirmationUrl.indexOf('token=') + 6);
        await api.publishEmail(
          {
            query: {
              groupSlug,
              token,
            },
          },
          {
            redirect: url => {
              expect(url).toContain('/testgroup/posts/re-hello-new-thread');
            },
          },
        );
      });
    });
  });
});
