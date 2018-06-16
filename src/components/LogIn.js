import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash/fp';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { baseAppColor, bg } from 'constants/colors';
import * as loginActions from 'actions/login';

import Button from 'components/common/Button';
import Input from 'components/common/Input';
import Icon from 'components/common/Icon';
import Anchor from 'components/common/Anchor';
import ExternalLink from 'components/common/ExternalLink';

import * as packageJson from '../../package.json';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  text-align: center;
  background: ${bg};

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
    padding: 10px;
    border: none;
    border-bottom: 1px solid ${baseAppColor};
    background: #fff;
    width: 300px;
  }

  p.options {
    bottom: 0;
    position: absolute;
    text-align: center;
    width: 100%;

    a {
      color: ${baseAppColor};
      text-decoration: underline;
      cursor: pointer;
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

export class LogIn extends React.Component {
  state = {
    loading: false,
    fieldsData: {},
    loginType: {
      enterprise: false,
      github: false,
      token: false,
      basic: false
    }
  };

  componentDidMount() {
    this.setLoginType('basic');
  }

  setLoginType = (type) => {
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
    this.setState({
      fieldsData: {
        ...this.state.fieldsData,
        [field]: value
      }
    });
  };

  loginWithBasic = (user, pass, twoFactorAuth) => {
    this.props.loginBasic(user, pass, twoFactorAuth);
  };

  render() {
    return (
      <LoginWrapper>

        <Logo>{ '{ Gisto }' }</Logo>
        <small>v{packageJson.version}</small>

        { this.state.loginType.github && (
          <StyledGithubLoginButton icon="logo-github" onClick={ null }>Log-in with GitHub</StyledGithubLoginButton>
        ) }

        { this.state.loginType.token && (
          <div>
            <h4>Sign-in using GitHub token</h4>
            <Input type="text"
                   placeholder="GitHub token"
                   onChange={ (event) => this.setField('token', event.target.value) }/>
            <ExternalLink target="_new" href="https://github.com/settings/tokens">
              <Icon type="info" size="16" color={ baseAppColor }/>
            </ExternalLink>
            <br/>
            <Button icon="success" onClick={ () => this.loginWithToken(this.state.fieldsData.token) }>Log-in</Button>
            <br/>
            <br/>
            <Anchor onClick={ () => this.setLoginType('basic') }>Cancel</Anchor>
          </div>
          ) }

        { this.state.loginType.enterprise && (
          <div>
            <h4>Setup enterprise endpoints and log-in</h4>
            <Input type="text"
                   onChange={ (event) => this.setField('enterpriseDomain', event.target.value) }
                   placeholder="Enterprise domain"/>
          </div>
        ) }

        { (this.state.loginType.basic || this.state.loginType.enterprise) && (
          <div>
            <h4>Sign-in using { this.state.loginType.enterprise ? 'your organization' : 'Github' } username and password</h4>

            <Input type="text"
                   onChange={ (event) => this.setField('username', event.target.value) }
                   placeholder="Email or username"/>
            <br/>

            <Input type="password"
                   onChange={ (event) => this.setField('password', event.target.value) }
                   placeholder="Password"/>
            <br/>

            { this.props.twoFactorAuth && (
              <Input type="text"
                     onChange={ (event) => this.setField('twoFactorAuth', event.target.value) }
                     placeholder="Two factor token (2fa)"/>
            ) }

            <ResetLoginType>
              <Anchor onClick={ () => this.setLoginType('github') }>Log-in with GitHub</Anchor>
              <Anchor onClick={ () => this.setLoginType('basic') }>Cancel</Anchor>
            </ResetLoginType>

            <br/>
            <br/>
            <Button onClick={
              () => this.loginWithBasic(
                this.state.fieldsData.username,
                this.state.fieldsData.password,
                this.state.fieldsData.twoFactorAuth
              ) }
                    icon="success">
              Log-in
            </Button>
            <br/>
          </div>
        ) }

        <p className="options">
          <strong>Other options:</strong>
          &nbsp;
          sign-in using GitHub
          &nbsp;
          <Anchor onClick={ () => this.setLoginType('token') }>token</Anchor>
          &nbsp;|&nbsp;
          <Anchor onClick={ () => this.setLoginType('basic') }>username and password</Anchor>
          &nbsp;|&nbsp;
          <Anchor onClick={ () => this.setLoginType('enterprise') }>Use enterprise</Anchor>
        </p>

        { this.state.loading && (
          <p><Icon type="loading" color="#555"/> Loading...</p>
        ) }
      </LoginWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  twoFactorAuth: get(['login', 'twoFactorAuth'], state)
});

LogIn.propTypes = {
  loginBasic: PropTypes.func,
  twoFactorAuth: PropTypes.string
};

export default connect(mapStateToProps, {
  loginBasic: loginActions.loginWithBasicAuth
})(withRouter(LogIn));
