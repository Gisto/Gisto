import React, { Component } from 'react';
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
import { isElectron } from 'utils/electron';

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

  ${(props) => props.onClick && `
  &:hover {
    transform: scale(1.5); 
  }
  `}
  
  .selected & {
    background-color: ${baseAppColor};
  }
`;

export class Snippet extends Component {
  toggleStar = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { setStar, unsetStar, snippet } = this.props;
    const isStarred = get('star', snippet);

    return isStarred ? unsetStar(snippet.id) : setStar(snippet.id);
  };

  deleteSnippet = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { snippet } = this.props;
    // eslint-disable-next-line no-restricted-globals, no-alert
    const sure = confirm(`Are you sure you want to delete "${snippet.description}"?`);

    if (sure === true) {
      this.props.deleteSnippet(snippet.id);

      return true;
    }

    return false;
  };

  onContextMenu = (event, snippet) => {
    event.preventDefault();
    event.stopPropagation();
    event.persist();

    const { remote } = require('electron');
    const { Menu, MenuItem } = remote;
    const menu = new Menu();

    menu.append(new MenuItem({
      label: snippet.star ? 'Un-star' : 'Star',
      click: () => this.toggleStar(event)
    }));

    menu.append(new MenuItem({
      type: 'separator'
    }));

    menu.append(new MenuItem({
      label: 'Delete',
      click: () => this.deleteSnippet(event)
    }));

    menu.popup({ window: remote.getCurrentWindow() });
  };

  render() {
    const { snippet } = this.props;

    return (
      <Router>
        <StyledNavLink exact
                       className="link"
                       activeClassName="selected"
                       to={ `/snippet/${snippet.id}` }
                       onContextMenu={ isElectron
                         ? (event) => this.onContextMenu(event, snippet)
                         : null }>
          <span>
            <StyledIcon size={ 24 }
                      type={ snippet.public ? 'unlock' : 'lock' }
                      color={ lightText }/>
          </span>
          <span>
            <StyledIcon size={ 16 }
                      onClick={ this.toggleStar }
                      type={ snippet.star ? 'star-full' : 'star-empty' }
                      color={ lightText }/>
          </span>
          <Title>
            { removeTags(snippet.description) || 'unnamed' }
          </Title>
        </StyledNavLink>
      </Router>
    );
  }
}

Snippet.propTypes = {
  snippet: PropTypes.object,
  setStar: PropTypes.func,
  unsetStar: PropTypes.func,
  deleteSnippet: PropTypes.func
};

export default connect(null, {
  setStar: snippetActions.starSnippet,
  unsetStar: snippetActions.unStarSnippet,
  deleteSnippet: snippetActions.deleteSnippet
})(Snippet);
