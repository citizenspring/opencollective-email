import React from 'react';
import withIntl from '../lib/withIntl';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import styled from 'styled-components';
import PropTypes from '../lib/propTypes';
import { Router } from '../server/pages';

const hiddenTags = ['topbar', 'fr', 'nl', 'en', 'featured', 'hidden'];

const TagsListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const Tag = styled.a`
  display: inline-block;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  font-size: 10px;
  text-align: center;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  margin-right: 0.3rem;
  margin-bottom: 0.3rem;
  border-radius: 4px;
  padding: 2px 4px;
  cursor: pointer;
  color: ${props => (props.selected ? '#FF0044' : '#1f87ff')};
  background: ${props => (props.selected ? '#FFF0F0' : '#e0f1ff')};
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Label = styled.div`
  color: #666;
  margin-right: 0.5rem;
  font-size: 12px;
  text-transform: uppercase;
`;

class TagsList extends React.Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string),
    selected: PropTypes.string,
    date: PropTypes.string,
    showLabel: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(tag) {
    const { groupSlug, date } = this.props;
    if (tag === this.props.selected) {
      tag = null;
    }
    Router.pushRoute('group', { groupSlug, tag, date });
  }

  render() {
    const { showLabel, tags, selected } = this.props;
    return (
      <TagsListWrapper>
        {showLabel && (
          <Label>
            <FormattedMessage id="tags.filter.label" defaultMessage="Filter by tag" />:
          </Label>
        )}
        <List>
          {(tags || [])
            .filter(t => !hiddenTags.includes(t))
            .map((tag, key) => {
              if (typeof tag === 'string') {
                return (
                  <Tag key={key} selected={tag === selected} onClick={() => this.onClick(tag)}>
                    {tag}
                  </Tag>
                );
              } else {
                return (
                  <Tag key={key} selected={tag.label === selected} onClick={() => this.onClick(tag.label)}>
                    {tag.label} ({tag.weight})
                  </Tag>
                );
              }
            })}
        </List>
      </TagsListWrapper>
    );
  }
}

export default withIntl(TagsList);
