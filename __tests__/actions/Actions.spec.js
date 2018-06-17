import * as AT from 'constants/actionTypes';
import * as userActions from 'actions/user';
import * as loginActions from 'actions/login';

describe('ACTIONS - user', () => {
  test('getUser action should be created', () => {
    expect(userActions.getUser()).toEqual({ type: AT.GET_USER });
  });
});

describe('ACTIONS - login', () => {
  test('loginWithBasicAuth action should be created', () => {
    expect(loginActions.loginWithBasicAuth('user', 'pass', null)).toEqual({
      type: AT.LOGIN_BASIC,
      meta: {
        user: 'user',
        pass: 'pass',
        twoFactorAuth: null
      },
      payload: {
        user: 'user',
        pass: 'pass',
        twoFactorAuth: null
      }
    });
  });

  test('logout action should be created', () => {
    expect(loginActions.logout()).toEqual({ type: AT.LOGOUT });
  });
});
