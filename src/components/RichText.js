import React from 'react';
import styled from 'styled-components';
import autolinker from 'autolinker';
import { FormattedMessage } from 'react-intl';
import Link from './Link';

const Wrapper = styled.div`
  div {
    display: inline-block;
  }
  .edit {
    font-size: 1.4rem;
    display: inline-block;
    margin-left: 0.5rem;
    visibility: hidden;
  }
  &:hover {
    .edit {
      visibility: visible;
    }
  }
  ul {
    padding-left: 2rem;
  }
  ul li {
    margin: 0.5rem 0;
  }
  ul ul {
    margin-bottom: 2rem;
  }
  ul p {
    margin: 0;
  }
  img {
    max-width: 100%;
  }
  }
`;

export default function RichText({ html, children, mailto, href }) {
  return (
    <Wrapper>
      {html && (
        <div
          dangerouslySetInnerHTML={{
            __html: autolinker.link(html, {
              truncate: 30,
              replaceFn: match => {
                if (match.getType() === 'email') return true;
                // it looks like there is a bug to process already linked facebook urls:
                // e.g. <a href=https://www.facebook.com/hashtag/muntcentrum?epa=HASHTAG>#Muntcentrum</a>
                const post = html.substr(match.offset + match.getAnchorText().length);
                if (post.match(/^\?[^>]+>/)) return false;
              },
            }),
          }}
        />
      )}
      {children && <div>{children}</div>}
      {(mailto || href) && (
        <Link href={mailto || href} className="edit">
          ✏️
          <FormattedMessage id="edit" defaultMessage="edit" />
        </Link>
      )}
    </Wrapper>
  );
}
