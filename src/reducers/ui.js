import { set, flow } from 'lodash/fp';

import * as AT from 'constants/actionTypes';
import { theme, tintBackground, tintHeaderBgLightest } from 'constants/colors';
import { getAllSettings } from 'utils/settings';

const initialState = {
  snippets: {
    loading: false,
    edit: false,
    comments: false
  },
  rateLimit: {},
  settings: { ...getAllSettings(), theme }
};

export const ui = (state = initialState, action) => {
  switch (action.type) {
    case AT.GET_SNIPPETS.PENDING:
    case AT.GET_SNIPPET.PENDING:
    case AT.SET_STAR.PENDING:
    case AT.UNSET_STAR.PENDING:
    case AT.CREATE_SNIPPET.PENDING:
    case AT.DELETE_SNIPPET.PENDING:
    case AT.UPDATE_SNIPPET.PENDING: {
      return flow([set('snippets.comments', false), set('snippets.loading', true)])(state);
    }

    case AT.GET_SNIPPETS.SUCCESS:
    case AT.GET_SNIPPETS.FAILURE:
    case AT.GET_SNIPPET.SUCCESS:
    case AT.GET_SNIPPET.FAILURE:
    case AT.CREATE_SNIPPET.SUCCESS:
    case AT.CREATE_SNIPPET.FAILURE:
    case AT.DELETE_SNIPPET.SUCCESS:
    case AT.DELETE_SNIPPET.FAILURE:
    case AT.UPDATE_SNIPPET.FAILURE:
    case AT.SET_STAR.SUCCESS:
    case AT.SET_STAR.FAILURE:
    case AT.UNSET_STAR.SUCCESS:
    case AT.UNSET_STAR.FAILURE:
    case AT.LOGIN_WITH_TOKEN.SUCCESS:
    case AT.LOGIN_WITH_TOKEN.FAILURE:
    case AT.LOGIN_BASIC.SUCCESS:
    case AT.LOGIN_BASIC.FAILURE: {
      return flow([set('snippets.comments', false), set('snippets.loading', false)])(state);
    }

    case AT.START_EDIT_SNIPPET: {
      return flow([set('snippets.comments', false), set('snippets.edit', true)])(state);
    }

    case AT.UPDATE_SNIPPET.SUCCESS: {
      return flow([set('snippets.loading', false), set('snippets.edit', false)])(state);
    }

    case AT.STOP_EDIT_SNIPPET: {
      return set('snippets.edit', false, state);
    }

    case AT.GET_RATE_LIMIT.SUCCESS: {
      return flow([set('rateLimit', action.payload), set(['rateLimit', 'loading'], false)])(state);
    }

    case AT.GET_RATE_LIMIT.PENDING: {
      return set(['rateLimit', 'loading'], true, state);
    }

    case AT.TOGGLE_SNIPPET_COMMENTS: {
      return set('snippets.comments', !state.snippets.comments, state);
    }

    case AT.CHANGE_SETTINGS: {
      if (action.meta.isTheme) {
        return flow([
          set(['settings', action.payload.key], action.payload.value),
          set(['settings', 'theme', 'baseAppColor'], action.payload.value),
          set(
            ['settings', 'theme', 'headerBgLightest'],
            tintHeaderBgLightest(action.payload.value)
          ),
          set(['settings', 'theme', 'bg'], tintBackground(action.payload.value))
        ])(state);
      }

      if (action.meta.isBoolean) {
        const result = state.settings[action.payload.key] !== true;

        return set(['settings', action.payload.key], result, state);
      }

      return set(['settings', action.payload.key], action.payload.value, state);
    }

    default: {
      return state;
    }
  }
};
