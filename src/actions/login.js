import * as AT from 'constants/actionTypes';

export const loginWithBasicAuth = (user, pass, twoFactorAuth = null) => ({
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

export const logout = () => ({
  type: AT.LOGOUT
});
