import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { get } from 'lodash/fp';
import { HashRouter as Router, NavLink } from 'react-router-dom';

import { removeTags } from 'utils/tags';
import * as snippetActions from 'actions/snippets';
import { baseAppColor, bg, lightText } from 'constants/colors';
import { SIDEBAR_WIDTH } from 'constants/config';

import Icon from 'components/common/Icon';

const StyledNavLink = styled(NavLink)`
  background: ${baseAppColor};
  line-height: 30px;
  padding: 10px;
  text-decoration: none;
  color: ${bg};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: rgba(255,255,255,.2);
    color: ${bg};
  }
  &.selected {
    background: ${bg};
    color: ${baseAppColor};
  }
`;

const Title = styled.span`
  width: ${SIDEBAR_WIDTH - 100}px;
  line-height: 23px;
  font-size: 16px;
`;

const StyledIcon = styled(Icon)`
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.5);
  }
`;

export const Snippet = ({ snippet, setStar, unsetStar }) => {
  const starred = get('star', snippet);
  const toggleStar = (event, id, isStarred) => {
    event.preventDefault();
    event.stopPropagation();

    return isStarred ? unsetStar(id) : setStar(id);
  };

  return (
    <Router>
      <StyledNavLink exact
                     className="link"
                     activeClassName="selected"
                     to={ `/snippet/${snippet.id}` }>
        <span>
          <Icon size={ 24 }
              type={ snippet.public ? 'logo-github' : 'lock' }
              color={ lightText }/>
        </span>
        <span>
          <StyledIcon size={ 16 }
                      onClick={ (event) => toggleStar(event, snippet.id, starred) }
                      type={ snippet.star ? 'star-full' : 'star-empty' }
                      color={ lightText }/>
        </span>
        <Title>
          {removeTags(snippet.description) || 'unnamed'}
        </Title>
      </StyledNavLink>
    </Router>
  );
};

Snippet.propTypes = {
  snippet: PropTypes.object,
  setStar: PropTypes.func,
  unsetStar: PropTypes.func
};

export default connect(null, {
  setStar: snippetActions.starSnippet,
  unsetStar: snippetActions.unStarSnippet
})(Snippet);
