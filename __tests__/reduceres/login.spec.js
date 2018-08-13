import * as AT from 'constants/actionTypes';
import { login as reducer } from 'reducers/login';

const initialState = {
  loggedIn: false,
  twoFactorAuth: false,
  loading: false
};

describe('reducer - login', () => {

  test('should return initial state', () => {
    const action = {
      type: ''
    };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  test('should indicate 2fa needed', () => {
    const action = {
      type: AT.LOGIN_BASIC_REQUEST_2FA
    };
    const expectedResult = {
      loggedIn: false,
      twoFactorAuth: true,
      loading: false
    };

    expect(reducer(initialState, action)).toEqual(expectedResult);
  });

  test('should indicate LOGIN_WITH_TOKEN initiated', () => {
    const action = {
      type: AT.LOGIN_WITH_TOKEN.PENDING
    };
    const expectedResult = {
      loggedIn: false,
      twoFactorAuth: false,
      loading: true
    };

    expect(reducer(initialState, action)).toEqual(expectedResult);
  });

  test('should indicate LOGIN_WITH_TOKEN is success', () => {
    const action = {
      type: AT.LOGIN_WITH_TOKEN.SUCCESS
    };
    const initial = {
      loggedIn: false,
      twoFactorAuth: false,
      loading: true
    };
    const expectedResult = {
      loggedIn: false,
      twoFactorAuth: false,
      loading: false
    };

    expect(reducer(initial, action)).toEqual(expectedResult);
  });

  test('should indicate LOGIN_BASIC.SUCCESS is success', () => {
    const action = {
      type: AT.LOGIN_BASIC.SUCCESS
    };
    const initial = {
      loggedIn: false,
      twoFactorAuth: false,
      loading: true
    };
    const expectedResult = {
      loggedIn: true,
      twoFactorAuth: false,
      loading: false
    };

    expect(reducer(initial, action)).toEqual(expectedResult);
  });

});
