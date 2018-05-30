import { set } from 'lodash/fp';
import * as AT from 'constants/actionTypes';

const initialState = {
  user: {}
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case AT.GET_USER.SUCCESS: {
      return set('user', action.payload, state);
    }

    default: {
      return state;
    }
  }
};
