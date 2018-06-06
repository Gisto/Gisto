import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HashRouter as Router, NavLink } from 'react-router-dom';
import { removeTags } from 'utils/tags';
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

const Snippet = ({ snippet }) => (
  <Router>
    <StyledNavLink exact
                   className="link"
                   activeClassName="selected"
                   to={ `/snippet/${snippet.id}` }>
      <span>
        <Icon size={ 32 }
              type={ snippet.public ? 'unlock' : 'lock' }
              color={ lightText }/>
      </span>
      <span>
        <Icon size={ 16 }
              type={ snippet.star ? 'star-full' : 'star-empty' }
              color={ lightText }/>
      </span>
      <Title>
        { removeTags(snippet.description) || 'unnamed' }
      </Title>
    </StyledNavLink>
  </Router>
);

Snippet.propTypes = {
  snippet: PropTypes.object
};

export default Snippet;
