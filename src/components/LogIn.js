import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, isEmpty } from 'lodash/fp';
import styled from 'styled-components';
import { setNotification } from 'utils/notifications';
import * as superagent from 'superagent';
import * as loginActions from 'actions/login';

import {
 setEnterpriseDomain, setToken, isLoggedIn, removeEnterpriseDomain
} from 'utils/login';
import { isElectron } from 'utils/electron';
import { isomorphicReload } from 'utils/isomorphic';

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
        path: 'https://github.com/login/oauth/authorize?client_id=193ae0478f15bfda404e&scope=user,gist',
        callback() {
          isomorphicReload();
        }
      });
    }
  };

  checkLogin = () => {
    if (!isLoggedIn && window.location.href.match(/\?code=(.*)#\//) && window.location.href.match(/\?code=(.*)#\//)[1]) {
      const code = window.location.href.match(/\?code=(.*)/)[1];

      if (code) {
        superagent.get(`https://gisto-gatekeeper.azurewebsites.net/authenticate/${code}`)
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
    const left = Number((window.screen.width / 2) - (w / 2));
    const tops = Number((window.screen.height / 2) - (h / 2));

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
            <TokenInput type="text"
                        placeholder="GitHub token"
                        onChange={ (event) => this.setField('token', event.target.value) }/>
            <ExternalLink target="_new" href="https://github.com/settings/tokens">
              <Icon type="info" size="16" color={ this.props.theme.baseAppColor }/>
            </ExternalLink>
            <br/>
            <Button
              icon="success"
              onClick={ () => this.loginWithToken(this.state.fieldsData.token) }>
              Log-in
            </Button>
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
            <Button
              onClick={ () => this.loginWithBasic(
                this.state.fieldsData.username,
                this.state.fieldsData.password,
                this.state.fieldsData.twoFactorAuth
              ) }
              icon="success">
              Log-in
            </Button>
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
            <Loading color={ this.props.theme.baseAppColor } text="Loading..." />
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

export default connect(mapStateToProps, {
  loginBasic: loginActions.loginWithBasicAuth,
  loginWithToken: loginActions.loginWithToken
})(LogIn);
