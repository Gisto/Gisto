import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { baseAppColor, headerColor, lightText } from 'constants/colors';
import { SIDEBAR_WIDTH, logoText } from 'constants/config';
import Icon from 'components/common/Icon';
import UserArea from 'components/AppArea';
import { get } from 'lodash/fp';

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #fff;
  vertical-align: middle;
  height: 70px;
  line-height: 11px;
`;

export const HeaderSection = styled.div`
  background: ${baseAppColor};
  flex: 1;
  border-right: 1px solid ${baseAppColor};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  &:last-child {
    border: none;
  }
`;

const Logo = styled(HeaderSection)`
  width: ${SIDEBAR_WIDTH - 40}px;
  max-width: ${SIDEBAR_WIDTH - 40}px;
  padding: 20px;
  font-size: 20px;
  a {
    color: ${headerColor};
    text-decoration: none;
  }
`;

const MiddleArea = styled(HeaderSection)``;

const Loading = styled.span`
  align-self: center;
`;

export const MainHeader = ({ loading, rateLimit, edit }) => (
  <HeaderWrapper>
    { !edit && (
      <Logo>
        <Link to="/" title={ `API Rate limit: ${get(['rate', 'remaining'], rateLimit)}/${get(['rate', 'limit'], rateLimit)}` }>{ logoText }</Link>
      </Logo>
    ) }
    <MiddleArea>
      <Icon color={ lightText } type="menu"/>
      { loading && <Loading><Icon type="loading"/> { 'loading...' }</Loading> }
      <div>{ /* placeholder */ }</div>
    </MiddleArea>
    <UserArea/>
  </HeaderWrapper>
);

const mapStateToProps = (state) => ({
  loading: state.ui.snippets.loading,
  rateLimit: get(['ui', 'rateLimit'], state),
  edit: get(['ui', 'snippets', 'edit'], state)
});

MainHeader.propTypes = {
  loading: PropTypes.bool,
  edit: PropTypes.bool,
  rateLimit: PropTypes.object
};

export default connect(mapStateToProps)(MainHeader);
