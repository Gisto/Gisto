import * as AT from 'constants/actionTypes';
import * as loginActions from 'actions/login';

describe('ACTIONS - login', () => {
  test('loginWithBasicAuth action should be created', () => {
    expect(loginActions.loginWithBasicAuth('user', 'pass')).toEqual({
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

  test('loginWithToken action should be created', () => {
    expect(loginActions.loginWithToken('213-dsf-234-sdf')).toEqual({
      meta: {
        token: '213-dsf-234-sdf',
        popup: false
      },
      type: AT.LOGIN_WITH_TOKEN,
      payload: {
        token: '213-dsf-234-sdf'
      }
    });
  });
});
