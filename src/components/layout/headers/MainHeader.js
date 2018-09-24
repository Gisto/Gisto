import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { HashRouter as Router, Link } from 'react-router-dom';
import styled from 'styled-components';
import { get } from 'lodash/fp';

import { baseAppColor, headerColor, lightText } from 'constants/colors';
import { SIDEBAR_WIDTH, logoText } from 'constants/config';
import { isEnterpriseLogin } from 'utils/login';

import UserArea from 'components/AppArea';
import Loading from 'components/common/Loading';
import Button from 'components/common/controls/Button';

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

const StyledLink = styled(Link)`
  color: ${lightText};
  text-decoration: none;
  line-height: 25px;
`;

const LoadingIndicator = styled.span`
  align-self: center;
`;

export const MainHeader = ({ loading, rateLimit, edit }) => (
  <HeaderWrapper>
    { !edit && (
      <Logo>
        <Link to="/" title={ `API Rate limit: ${get(['rate', 'remaining'], rateLimit)}/${get(['rate', 'limit'], rateLimit)}` }>
          { logoText } { isEnterpriseLogin() && <small>enterprise</small> }
        </Link>
      </Logo>
    ) }
    <MiddleArea>
      { !edit && (
        <Router>
          <Button icon="add" height="30px" outline>
            <StyledLink to="/new">New snippet</StyledLink>
          </Button>
        </Router>
      ) }
      { loading && (
        <LoadingIndicator>
          <Loading text="Loading..."/>
        </LoadingIndicator>
      ) }
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
