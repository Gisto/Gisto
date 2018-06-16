import { set, flow } from 'lodash/fp';
import * as AT from 'constants/actionTypes';

const initialState = {
  loggedIn: false,
  twoFactorAuth: false
};

export const login = (state = initialState, action) => {
  switch (action.type) {
    case AT.LOGIN_BASIC_REQUEST_2FA: {
      return set('twoFactorAuth', true, state);
    }

    case AT.LOGIN_BASIC.SUCCESS: {
      return flow([
        set('loggedIn', true),
        set('twoFactorAuth', false)
      ])(state);
    }

    default: {
      return state;
    }
  }
};
