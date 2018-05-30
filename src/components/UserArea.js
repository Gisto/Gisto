import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SIDEBAR_WIDTH } from 'constants/config';
import { Link } from 'react-router-dom';

import * as userActions from 'actions/user';

import { baseAppColor, colorDanger, headerColor, lightText } from 'constants/colors';
import Icon from 'components/common/Icon';

const UserAreaWrapper = styled.div`
  background: ${baseAppColor};
  flex: 1;
  border-right: 1px solid ${baseAppColor};
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: ${SIDEBAR_WIDTH}px;
  justify-content: space-around;
  &:last-child {
    border: none;
  }
`;

const Avatar = styled.img`
  border-radius: 4px;
  border:1px solid ${headerColor};
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
        <Link to="/"><Icon color={ lightText } type="dashboard"/></Link>
        <Link to="/about"><Icon color={ lightText } type="info"/></Link>
        <Icon type="globe" color={ isOnLine() ? lightText : colorDanger }/>
        <Link to="/settings"><Icon color={ lightText } type="cog"/></Link>
        <Avatar
          src={ avatar }
          width="32"
          height="32"/>
        <span title={ login }>{ name }</span>
      </UserAreaWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users.user
});

UserArea.propTypes = {
  user: PropTypes.object,
  getUser: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  getUser: userActions.getUser
})(UserArea);
