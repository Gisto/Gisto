import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { HashRouter as Router, Link } from 'react-router-dom';
import styled from 'styled-components';
import { get } from 'lodash/fp';

import * as snippetsActions from 'actions/snippets';

import {
  baseAppColor, headerBgLightest, headerColor, lightText
} from 'constants/colors';
import { SIDEBAR_WIDTH, logoText } from 'constants/config';
import { isEnterpriseLogin } from 'utils/login';
import { toUnixTimeStamp } from 'utils/date';

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
  width: ${SIDEBAR_WIDTH - 20}px;
  max-width: ${SIDEBAR_WIDTH - 20}px;
  padding: 20px 0 20px 20px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const RateLimit = styled.span`
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: ${headerBgLightest};
  cursor: pointer;
  
  &:hover {
    color: ${lightText};
  }
  
  > small {
    font-size: 8px;
  } 
`;

export const MainHeader = ({
  loading, rateLimit, edit, isCreateNew, getRateLimit
}) => {
  const apiLimitResetTime = Math.floor((get(['rate', 'reset'], rateLimit) - toUnixTimeStamp(new Date().getTime())) / 60);

  return (
    <HeaderWrapper>
      {!edit && (
        <Logo>
          <Link to="/">
            {logoText} {isEnterpriseLogin() && <small>enterprise</small>}
          </Link>
          {!isCreateNew && (
            <Router>
              <Button icon="add" height="30px" outline>
                <StyledLink to="/new">New snippet</StyledLink>
              </Button>
            </Router>
          )}
        </Logo>
      )}
      <MiddleArea>
        {loading ? (
          <LoadingIndicator>
            <Loading text="Loading..."/>
          </LoadingIndicator>
        ) : <div/>}

        { get(['loading'], rateLimit) ? (
          <Loading text=""/>
        ) : (
          <RateLimit onClick={ () => getRateLimit() }
                     title="Click to reload">
            <small>API rate limit:</small>
            <br/>
            {`${get(['rate', 'remaining'], rateLimit)}/${get(['rate', 'limit'], rateLimit)}`}
            <br/>
            <small>Reset in { apiLimitResetTime } min.</small>
          </RateLimit>
        ) }

      </MiddleArea>
      <UserArea/>
    </HeaderWrapper>
  );
};

const mapStateToProps = (state) => ({
  loading: state.ui.snippets.loading,
  rateLimit: get(['ui', 'rateLimit'], state),
  edit: get(['ui', 'snippets', 'edit'], state),
  isCreateNew: get(['router', 'location', 'pathname'], state) === '/new'
});

MainHeader.propTypes = {
  loading: PropTypes.bool,
  edit: PropTypes.bool,
  rateLimit: PropTypes.object,
  isCreateNew: PropTypes.bool,
  getRateLimit: PropTypes.func
};

export default connect(mapStateToProps, {
  getRateLimit: snippetsActions.getRateLimit
})(MainHeader);
