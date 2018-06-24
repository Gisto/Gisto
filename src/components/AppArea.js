import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SIDEBAR_WIDTH } from 'constants/config';
import { Link } from 'react-router-dom';

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
  width: min-content;
  line-height: 21px;
  padding: 20px;
  z-index: 3;
  text-align: left;
  color: ${textColor};
  position: relative;
  top: 17px;
  box-shadow: 0 5px 30px ${textColor};
`;

export class AppArea extends React.Component {
  state = {
    message: ''
  };

  componentDidMount() {
    this.props.getUser();
    ipcRenderer.on('message', (event, text, info) => this.setState({ message: text }));
  }

  render() {
    const { login, avatar_url: avatar, name } = this.props.user;

    return (
      <UserAreaWrapper>
        { this.state.message && (
          <StyledUtilityIcon color={ colorWarning }
                     type="flash"
                     dropdown>
            <UpdaterMenu>{ this.state.message }</UpdaterMenu>
          </StyledUtilityIcon>
        ) }
        <Link to="/"><Icon color={ lightText } type="dashboard"/></Link>
        <Link to="/about"><Icon color={ lightText } type="info"/></Link>
        <Icon type="globe" color={ window.navigator.onLine ? lightText : colorDanger }/>
        <Link to="/settings"><Icon color={ lightText } type="cog"/></Link>
        <Avatar
          title={ name || login }
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
