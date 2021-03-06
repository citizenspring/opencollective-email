import React from 'react';
import PropTypes from '../lib/propTypes';
import StyledLink from './StyledLink';
import styled from 'styled-components';
import Link from './Link';
import { Title, Subtitle } from '../styles/layout';
import TagsList from './TagsList';
import { Box, Flex } from '@rebass/grid';

const Wrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const Actions = styled.div`
  display: flex;
`;
const Action = styled.div`
  margin: 0.5rem;
`;

export default function TitleWithActions({ title, subtitle, actions, tags, groupSlug }) {
  return (
    <Flex alignItems="baseline" flexDirection="column">
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {tags && (
        <Box mt={[-2, -3, -3]} mb={[2, 1, 1]}>
          <TagsList tags={tags} groupSlug={groupSlug} />
        </Box>
      )}
      <Flex>
        {actions &&
          actions.map((action, i) => (
            <Box mx={1} mt={-3} mb={4} key={i}>
              <Link href={action.href}>
                <StyledLink buttonStyle={action.style || 'primary'} buttonSize="small">
                  {action.label}
                </StyledLink>
              </Link>
            </Box>
          ))}
      </Flex>
    </Flex>
  );
}
