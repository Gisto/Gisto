import { set } from 'lodash/fp';
import * as AT from 'constants/actionTypes';

const initialState = {
  emoji: {}
};

export const emoji = (state = initialState, action) => {
  switch (action.type) {
    case AT.GET_EMOJI.SUCCESS: {
      return set('emoji', action.payload, state);
    }

    default: {
      return state;
    }
  }
};
