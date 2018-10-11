import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { SIDEBAR_WIDTH } from 'constants/config';

import * as userActions from 'actions/user';
import * as loginActions from 'actions/login';

import {
  baseAppColor,
  headerColor,
  lightText
} from 'constants/colors';

import Icon from 'components/common/Icon';
import Updater from 'components/layout/Updater';
import Loading from 'components/common/Loading';

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

export class AppArea extends React.Component {
  componentDidMount() {
    this.props.getUser();
  }

  render() {
    const { login, avatar_url: avatar } = this.props.user;

    return (
      <UserAreaWrapper>
        <Updater/>
        <Link to="/">
          <Icon color={ lightText } type="dashboard" spin />
        </Link>
        <Link to="/about">
          <Icon color={ lightText } type="info" spin />
        </Link>

        { !this.props.online && (
          <Loading spinner={ false }/>
        ) }

        <Link to="/settings">
          <Icon color={ lightText } type="cog" spin />
        </Link>
        <Avatar
          title={ login && login.charAt(0) + login.charAt(1) }
          alt={ login && login.charAt(0) + login.charAt(1) }
          src={ avatar }
          width="32"
          height="32"/>
        <Link to="/">
          <Icon type="logout" color={ lightText } onClick={ () => this.props.logout() } />
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
  logout: PropTypes.func.isRequired,
  online: PropTypes.bool
};

export default connect(mapStateToProps, {
  getUser: userActions.getUser,
  logout: loginActions.logout
})(AppArea);
