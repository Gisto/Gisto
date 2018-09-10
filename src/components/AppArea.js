import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { get, replace } from 'lodash/fp';

import { SIDEBAR_WIDTH } from 'constants/config';

import { isElectron } from 'utils/electron';

import * as userActions from 'actions/user';
import * as loginActions from 'actions/login';

import {
  baseAppColor,
  colorDanger,
  headerColor,
  lightText,
  colorWarning,
  textColor
} from 'constants/colors';
import Icon from 'components/common/Icon';
import UtilityIcon from 'components/common/UtilityIcon';
import Anchor from 'components/common/Anchor';

const UserAreaWrapper = styled.div`
  background: ${baseAppColor};
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: ${SIDEBAR_WIDTH}px;
  justify-content: space-around;
`;

const Avatar = styled.img`
  border-radius: 4px;
  border: 1px solid ${headerColor};
  line-height: 31px;
  text-align: center;
`;

const StyledUtilityIcon = styled(UtilityIcon)`
  height: 21px;
  display: inline-block;
  width: 20px;
  text-align: center;
  line-height: 21px;
  cursor: pointer;
  position: relative;
  margin: 0;
  padding: 0;
  border: none;
  
  &:hover {
  background: transparent;
  }
`;

const UpdaterMenu = styled.div`
  background: ${lightText};
  width: max-content;
  line-height: 21px;
  padding: 20px;
  z-index: 3;
  text-align: left;
  color: ${textColor};
  position: relative;
  top: 17px;
  box-shadow: 0 5px 30px ${textColor};
  cursor: default;
`;

export class AppArea extends React.Component {
  state = {
    message: ''
  };

  componentDidMount() {
    this.props.getUser();
    if (isElectron) {
      const { ipcRenderer } = require('electron');

      ipcRenderer.on('updateInfo', (event, text, info) => {
        if (get('url', info)) {
          const message = (
            <React.Fragment>
              <strong>{ text }</strong><br/>
              <Anchor href={ replace('-mac.zip', '.dmg', info.url) }>Download</Anchor>
            </React.Fragment>
          );

          this.setState({ message });
        } else {
          this.setState({ message: text });
        }
      });
    }
  }

  render() {
    const { login, avatar_url: avatar, name } = this.props.user;

    return (
      <UserAreaWrapper>
        { this.state.message && (
          <StyledUtilityIcon color={ colorWarning }
                     type="flash"
                     dropdown>
            <UpdaterMenu>
              { this.state.message }
            </UpdaterMenu>
          </StyledUtilityIcon>
        ) }
        <Link to="/">
          <Icon color={ lightText } type="dashboard" spin/>
        </Link>
        <Link to="/about">
          <Icon color={ lightText } type="info" spin/>
        </Link>
        <Icon type="globe" color={ window.navigator.onLine ? lightText : colorDanger }/>
        <Link to="/settings">
          <Icon color={ lightText } type="cog" spin/>
        </Link>
        <Avatar
          title={ login && login.charAt(0) + login.charAt(1) }
          alt={ name || login }
          src={ avatar }
          width="32"
          height="32"/>
        <Link to="/">
          <Icon type="logout" color={ lightText } onClick={ () => this.props.logout() }/>
        </Link>
      </UserAreaWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users.user
});

AppArea.propTypes = {
  user: PropTypes.object,
  getUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  getUser: userActions.getUser,
  logout: loginActions.logout
})(AppArea);
