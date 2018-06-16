import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SIDEBAR_WIDTH } from 'constants/config';
import { Link } from 'react-router-dom';

import * as userActions from 'actions/user';
import * as loginActions from 'actions/login';

import { baseAppColor, colorDanger, headerColor, lightText, colorWarning } from 'constants/colors';
import Icon from 'components/common/Icon';

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

const isOnLine = () => window.navigator.onLine;

export class UserArea extends React.Component {
  componentDidMount() {
    this.props.getUser();
  }

  render() {
    const { login, avatar_url: avatar, name } = this.props.user;

    return (
      <UserAreaWrapper>
        <Icon color={ colorWarning } type="flash"/>
        <Link to="/"><Icon color={ lightText } type="dashboard"/></Link>
        <Link to="/about"><Icon color={ lightText } type="info"/></Link>
        <Icon type="globe" color={ isOnLine() ? lightText : colorDanger }/>
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

UserArea.propTypes = {
  user: PropTypes.object,
  getUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  getUser: userActions.getUser,
  logout: loginActions.logout
})(UserArea);
