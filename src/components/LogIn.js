import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, isEmpty } from 'lodash/fp';
import styled from 'styled-components';
import { setNotification } from 'utils/notifications';
import * as superagent from 'superagent';
import * as loginActions from 'actions/login';

import { setEnterpriseDomain, setToken, isLoggedIn, removeEnterpriseDomain } from 'utils/login';
import { isElectron } from 'utils/electron';
import { isomorphicReload } from 'utils/isomorphic';

import { ligten } from 'constants/colors';

import Button from 'components/common/controls/Button';
import Input from 'components/common/controls/Input';
import Icon from 'components/common/Icon';
import Anchor from 'components/common/Anchor';
import ExternalLink from 'components/common/ExternalLink';
import Loading from 'components/common/Loading';

import * as packageJson from '../../package.json';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  text-align: center;
  background: ${(props) => props.theme.bg};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='100%25' gradientTransform='rotate(240)'%3E%3Cstop offset='0' stop-color='%23ffffff'/%3E%3Cstop offset='1' stop-color='%23ffffff'/%3E%3C/linearGradient%3E%3Cpattern patternUnits='userSpaceOnUse' id='b' width='1235' height='1029.2' x='0' y='0' viewBox='0 0 1080 900'%3E%3Cg fill-opacity='0.07'%3E%3Cpolygon fill='%23444' points='90 150 0 300 180 300'/%3E%3Cpolygon points='90 150 180 0 0 0'/%3E%3Cpolygon fill='%23AAA' points='270 150 360 0 180 0'/%3E%3Cpolygon fill='%23DDD' points='450 150 360 300 540 300'/%3E%3Cpolygon fill='%23999' points='450 150 540 0 360 0'/%3E%3Cpolygon points='630 150 540 300 720 300'/%3E%3Cpolygon fill='%23DDD' points='630 150 720 0 540 0'/%3E%3Cpolygon fill='%23444' points='810 150 720 300 900 300'/%3E%3Cpolygon fill='%23FFF' points='810 150 900 0 720 0'/%3E%3Cpolygon fill='%23DDD' points='990 150 900 300 1080 300'/%3E%3Cpolygon fill='%23444' points='990 150 1080 0 900 0'/%3E%3Cpolygon fill='%23DDD' points='90 450 0 600 180 600'/%3E%3Cpolygon points='90 450 180 300 0 300'/%3E%3Cpolygon fill='%23666' points='270 450 180 600 360 600'/%3E%3Cpolygon fill='%23AAA' points='270 450 360 300 180 300'/%3E%3Cpolygon fill='%23DDD' points='450 450 360 600 540 600'/%3E%3Cpolygon fill='%23999' points='450 450 540 300 360 300'/%3E%3Cpolygon fill='%23999' points='630 450 540 600 720 600'/%3E%3Cpolygon fill='%23FFF' points='630 450 720 300 540 300'/%3E%3Cpolygon points='810 450 720 600 900 600'/%3E%3Cpolygon fill='%23DDD' points='810 450 900 300 720 300'/%3E%3Cpolygon fill='%23AAA' points='990 450 900 600 1080 600'/%3E%3Cpolygon fill='%23444' points='990 450 1080 300 900 300'/%3E%3Cpolygon fill='%23222' points='90 750 0 900 180 900'/%3E%3Cpolygon points='270 750 180 900 360 900'/%3E%3Cpolygon fill='%23DDD' points='270 750 360 600 180 600'/%3E%3Cpolygon points='450 750 540 600 360 600'/%3E%3Cpolygon points='630 750 540 900 720 900'/%3E%3Cpolygon fill='%23444' points='630 750 720 600 540 600'/%3E%3Cpolygon fill='%23AAA' points='810 750 720 900 900 900'/%3E%3Cpolygon fill='%23666' points='810 750 900 600 720 600'/%3E%3Cpolygon fill='%23999' points='990 750 900 900 1080 900'/%3E%3Cpolygon fill='%23999' points='180 0 90 150 270 150'/%3E%3Cpolygon fill='%23444' points='360 0 270 150 450 150'/%3E%3Cpolygon fill='%23FFF' points='540 0 450 150 630 150'/%3E%3Cpolygon points='900 0 810 150 990 150'/%3E%3Cpolygon fill='%23222' points='0 300 -90 450 90 450'/%3E%3Cpolygon fill='%23FFF' points='0 300 90 150 -90 150'/%3E%3Cpolygon fill='%23FFF' points='180 300 90 450 270 450'/%3E%3Cpolygon fill='%23666' points='180 300 270 150 90 150'/%3E%3Cpolygon fill='%23222' points='360 300 270 450 450 450'/%3E%3Cpolygon fill='%23FFF' points='360 300 450 150 270 150'/%3E%3Cpolygon fill='%23444' points='540 300 450 450 630 450'/%3E%3Cpolygon fill='%23222' points='540 300 630 150 450 150'/%3E%3Cpolygon fill='%23AAA' points='720 300 630 450 810 450'/%3E%3Cpolygon fill='%23666' points='720 300 810 150 630 150'/%3E%3Cpolygon fill='%23FFF' points='900 300 810 450 990 450'/%3E%3Cpolygon fill='%23999' points='900 300 990 150 810 150'/%3E%3Cpolygon points='0 600 -90 750 90 750'/%3E%3Cpolygon fill='%23666' points='0 600 90 450 -90 450'/%3E%3Cpolygon fill='%23AAA' points='180 600 90 750 270 750'/%3E%3Cpolygon fill='%23444' points='180 600 270 450 90 450'/%3E%3Cpolygon fill='%23444' points='360 600 270 750 450 750'/%3E%3Cpolygon fill='%23999' points='360 600 450 450 270 450'/%3E%3Cpolygon fill='%23666' points='540 600 630 450 450 450'/%3E%3Cpolygon fill='%23222' points='720 600 630 750 810 750'/%3E%3Cpolygon fill='%23FFF' points='900 600 810 750 990 750'/%3E%3Cpolygon fill='%23222' points='900 600 990 450 810 450'/%3E%3Cpolygon fill='%23DDD' points='0 900 90 750 -90 750'/%3E%3Cpolygon fill='%23444' points='180 900 270 750 90 750'/%3E%3Cpolygon fill='%23FFF' points='360 900 450 750 270 750'/%3E%3Cpolygon fill='%23AAA' points='540 900 630 750 450 750'/%3E%3Cpolygon fill='%23FFF' points='720 900 810 750 630 750'/%3E%3Cpolygon fill='%23222' points='900 900 990 750 810 750'/%3E%3Cpolygon fill='%23222' points='1080 300 990 450 1170 450'/%3E%3Cpolygon fill='%23FFF' points='1080 300 1170 150 990 150'/%3E%3Cpolygon points='1080 600 990 750 1170 750'/%3E%3Cpolygon fill='%23666' points='1080 600 1170 450 990 450'/%3E%3Cpolygon fill='%23DDD' points='1080 900 1170 750 990 750'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect x='0' y='0' fill='url(%23b)' width='100%25' height='100%25'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;

  small {
    display: block;
    font-size: 12px;
    margin-bottom: 20px;
  }

  button {
    font-size: 16px;
    line-height: 11px;
    height: 40px;
    padding: 0 20px;
  }

  input {
    padding: 5px 10px;
    margin-bottom: 20px;
    border: none;
    border-bottom: 1px solid ${(props) => props.theme.baseAppColor};
    background: #fff;
    width: 300px;
  }

  p.options {
    bottom: 0;
    position: absolute;
    text-align: center;
    width: 100%;

    a {
      color: ${(props) => props.theme.baseAppColor};
      text-decoration: underline;
      cursor: pointer;

      :hover {
        color: ${(props) => props.theme.headerBgLightest};
      }
    }
  }
`;

const StyledGithubLoginButton = styled(Button)`
  width: 200px;
  align-self: center;

  :hover {
    background: ${(props) => ligten(props.theme.baseAppColor)};
  }
`;

const StyledLoginButton = styled(Button)`
  margin: 0 auto;

  :hover {
    background: ${(props) => ligten(props.theme.baseAppColor)};
  }
`;

const Logo = styled.div`
  font-size: 42px;
  font-weight: 200;
`;

const ResetLoginType = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 320px;
  margin: 10px auto 0;
`;

const TokenInput = styled(Input)`
  margin-right: 10px;
  margin-left: 10px;
`;

const Small = styled.p`
  font-size: 12px;
  margin: -20px 0 10px;
`;

export class LogIn extends React.Component {
  state = {
    fieldsData: {},
    loginType: {
      enterprise: false,
      github: false,
      token: false,
      basic: false
    }
  };

  componentDidMount() {
    if (isElectron) {
      this.setLoginType('github');
    } else {
      this.setLoginType('basic');
    }
  }

  setLoginType = (type) => {
    removeEnterpriseDomain();
    this.setState({
      fieldsData: {},
      loginType: {
        enterprise: type === 'enterprise',
        github: type === 'github',
        token: type === 'token',
        basic: type === 'basic'
      }
    });
  };

  setField = (field, value) => {
    this.setState((prevState) => ({
      fieldsData: {
        ...prevState.fieldsData,
        [field]: value
      }
    }));
  };

  loginWithToken = (token) => {
    if (isEmpty(this.state.fieldsData.token)) {
      setNotification({
        title: 'Validation',
        body: 'Looks like <b>Token</b> field left empty',
        type: 'error'
      });

      return null;
    }

    return this.props.loginWithToken(token || this.state.fieldsData.token);
  };

  loginWithBasic = (user, pass, twoFactorAuth) => {
    if (isEmpty(user) || isEmpty(pass)) {
      setNotification({
        title: 'Validation',
        body: 'Looks like <b>Username</b> or <b>Password</b> left empty',
        type: 'error'
      });

      return null;
    }

    if (this.state.fieldsData.enterpriseDomain) {
      setEnterpriseDomain(this.state.fieldsData.enterpriseDomain);
    }

    return this.props.loginBasic(user, pass, twoFactorAuth);
  };

  loginWithOauth2 = () => {
    if (isElectron) {
      const { ipcRenderer } = require('electron');

      ipcRenderer.send('oauth2-login');
    } else {
      this.showAuthWindow({
        path:
          'https://github.com/login/oauth/authorize?client_id=193ae0478f15bfda404e&scope=user,gist',
        callback() {
          isomorphicReload();
        }
      });
    }
  };

  checkLogin = () => {
    if (
      !isLoggedIn &&
      window.location.href.match(/\?code=(.*)#\//) &&
      window.location.href.match(/\?code=(.*)#\//)[1]
    ) {
      const code = window.location.href.match(/\?code=(.*)/)[1];

      if (code) {
        superagent
          .get(`https://gisto-gatekeeper.azurewebsites.net/authenticate/${code}`)
          .end((error, result) => {
            if (result && result.body.token) {
              this.props.loginWithToken(result.body.token, true);
            }
          });
      }
    }
  };

  showAuthWindow = (options) => {
    const w = 800;
    const h = 600;
    const left = Number(window.screen.width / 2 - w / 2);
    const tops = Number(window.screen.height / 2 - h / 2);

    const windowName = 'Login with github';
    const windowOptions = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${tops}, left=${left}`;
    const that = this;

    that._oauthWindow = window.open(options.path, windowName, windowOptions);
    that._oauthInterval = window.setInterval(() => {
      if (that._oauthWindow.closed) {
        window.clearInterval(that._oauthInterval);
        options.callback();
      }
    }, 1000);
  };

  render() {
    if (isElectron) {
      const { ipcRenderer } = require('electron');

      ipcRenderer.on('token', (event, token) => {
        setToken(token);

        isomorphicReload();
      });
    }
    if (!isLoggedIn) {
      this.checkLogin();
    }

    return (
      <LoginWrapper>
        <Logo>{'{ Gisto }'}</Logo>
        <small>v{packageJson.version}</small>

        {this.state.loginType.github && (
          <StyledGithubLoginButton icon="logo-github" onClick={ () => this.loginWithOauth2() }>
            Log-in with GitHub
          </StyledGithubLoginButton>
        )}

        {this.state.loginType.token && (
          <div>
            <h4>Sign-in using GitHub token</h4>
            <Small>(Only &quot;gist&quot; scope needed)</Small>
            <TokenInput
              type="text"
              placeholder="GitHub token"
              onChange={ (event) => this.setField('token', event.target.value) }/>
            <ExternalLink target="_new" href="https://github.com/settings/tokens">
              <Icon
                title="(Only 'gist' scope needed)"
                type="info"
                size="16"
                color={ this.props.theme.baseAppColor }/>
            </ExternalLink>
            <br/>
            <StyledLoginButton
              icon="success"
              onClick={ () => this.loginWithToken(this.state.fieldsData.token) }>
              Log-in
            </StyledLoginButton>
            <br/>
            <br/>
            <Anchor onClick={ () => this.setLoginType('basic') }>Cancel</Anchor>
          </div>
        )}

        {this.state.loginType.enterprise && (
          <div>
            <h4>Setup enterprise endpoints and log-in</h4>
            <Input
              type="text"
              onChange={ (event) => this.setField('enterpriseDomain', event.target.value) }
              placeholder="http://my.enterprise.domain.com"/>
          </div>
        )}

        {(this.state.loginType.basic || this.state.loginType.enterprise) && (
          <div>
            <h4>
              Sign-in using {this.state.loginType.enterprise ? 'your organization' : 'Github'}{' '}
              username and password
            </h4>

            <Input
              type="text"
              onChange={ (event) => this.setField('username', event.target.value) }
              placeholder="Email or username"/>
            <br/>

            <Input
              type="password"
              onChange={ (event) => this.setField('password', event.target.value) }
              placeholder="Password"/>
            <br/>

            {this.props.twoFactorAuth && (
              <Input
                type="text"
                onChange={ (event) => this.setField('twoFactorAuth', event.target.value) }
                placeholder="Two factor token (2fa)"/>
            )}

            <ResetLoginType>
              <Anchor onClick={ () => this.setLoginType('github') }>Log-in with GitHub</Anchor>
              <Anchor onClick={ () => this.setLoginType('basic') }>Cancel</Anchor>
            </ResetLoginType>

            <br/>
            <br/>
            <StyledLoginButton
              onClick={ () =>
                this.loginWithBasic(
                  this.state.fieldsData.username,
                  this.state.fieldsData.password,
                  this.state.fieldsData.twoFactorAuth
                )
              }
              icon="success">
              Log-in
            </StyledLoginButton>
            <br/>
          </div>
        )}

        <p className="options">
          <strong>Other options:</strong>
          &nbsp; sign-in using GitHub &nbsp;
          <Anchor onClick={ () => this.setLoginType('token') }>token</Anchor>
          &nbsp;|&nbsp;
          <Anchor onClick={ () => this.setLoginType('basic') }>username and password</Anchor>
          &nbsp;|&nbsp;
          <Anchor onClick={ () => this.setLoginType('enterprise') }>Use enterprise</Anchor>
        </p>

        {this.props.loading && (
          <p>
            <Loading color={ this.props.theme.baseAppColor } text="Loading..."/>
          </p>
        )}
      </LoginWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  twoFactorAuth: get(['login', 'twoFactorAuth'], state),
  loading: get(['login', 'loading'], state),
  theme: get(['ui', 'settings', 'theme'], state)
});

LogIn.propTypes = {
  loginBasic: PropTypes.func,
  loginWithToken: PropTypes.func,
  twoFactorAuth: PropTypes.bool,
  loading: PropTypes.bool,
  theme: PropTypes.object
};

export default connect(
  mapStateToProps,
  {
    loginBasic: loginActions.loginWithBasicAuth,
    loginWithToken: loginActions.loginWithToken
  }
)(LogIn);
