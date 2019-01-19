import * as AT from 'constants/actionTypes';

export const loginWithBasicAuth = (user: string, pass: string, twoFactorAuth = null) => ({
  meta: {
    user,
    pass,
    twoFactorAuth
  },
  type: AT.LOGIN_BASIC,
  payload: {
    user,
    pass,
    twoFactorAuth
  }
});

export const loginWithToken = (token: string, popup = false) => ({
  meta: {
    token, popup
  },
  type: AT.LOGIN_WITH_TOKEN,
  payload: {
    token
  }
});

export const logout = () => ({
  type: AT.LOGOUT
});
