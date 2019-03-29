import { set, flow } from 'lodash/fp';
import * as AT from 'constants/actionTypes';

const initialState = {
  loggedIn: false,
  twoFactorAuth: false,
  loading: false
};

export const login = (state = initialState, action) => {
  switch (action.type) {
    case AT.LOGIN_BASIC_REQUEST_2FA: {
      return set('twoFactorAuth', true, state);
    }

    case AT.LOGIN_WITH_TOKEN.PENDING:
    case AT.LOGIN_BASIC.PENDING: {
      return set('loading', true, state);
    }

    case AT.LOGIN_WITH_TOKEN.SUCCESS:
    case AT.LOGIN_WITH_TOKEN.FAILURE:
    case AT.LOGIN_BASIC.FAILURE: {
      return set('loading', false, state);
    }

    case AT.LOGIN_BASIC.SUCCESS: {
      return flow([set('loggedIn', true), set('twoFactorAuth', false), set('loading', false)])(
        state
      );
    }

    default: {
      return state;
    }
  }
};
