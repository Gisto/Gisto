import { set } from 'lodash/fp';

import * as AT from 'constants/actionTypes';

const initialState = {
  snippets: {
    loading: false
  }
};

export const ui = (state = initialState, action) => {
  switch (action.type) {
    case AT.GET_SNIPPETS.PENDING:
    case AT.GET_SNIPPET.PENDING: {
      return set('snippets.loading', true, state);
    }

    case AT.GET_SNIPPETS.SUCCESS:
    case AT.GET_SNIPPETS.FAILURE:
    case AT.GET_SNIPPET.SUCCESS:
    case AT.GET_SNIPPET.FAILURE: {
      return set('snippets.loading', false, state);
    }

    default: {
      return state;
    }
  }
};
