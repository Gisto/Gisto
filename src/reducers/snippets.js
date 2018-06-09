import { merge, keyBy, update, set, map, flow, concat, includes, without } from 'lodash/fp';
import * as AT from 'constants/actionTypes';
import { snippetStructure } from 'utils/prepareSnippet';

const initialState = {
  snippets: {},
  starred: [],
  filter: {
    text: '',
    tags: [],
    language: ''
  },
  lastOpenedId: null,
  new: {
    description: '',
    public: true,
    tags: [],
    files: []
  },
  edit: {}
};

export const snippets = (state = initialState, action) => {
  switch (action.type) {
    case AT.GET_SNIPPETS.SUCCESS: {
      return update('snippets', () => merge(keyBy('id', map((snippet) => snippetStructure(snippet, state.starred), action.payload)), state.snippets), state);
    }

    case AT.GET_SNIPPET.SUCCESS: {
      return flow([
        set(['snippets', action.payload.id], snippetStructure(action.payload, state.starred)),
        set('lastOpenedId', action.payload.id)
      ])(state);
    }

    case AT.GET_STARRED_SNIPPETS.SUCCESS: {
      return set('starred', map('id', action.payload), state);
    }

    case AT.FILTER_SNIPPETS_BY_TEXT: {
      return flow([
        set(['filter', 'text'], action.payload.value),
        set(['filter', 'tags'], []),
        set(['filter', 'language'], '')
      ])(state);
    }

    case AT.FILTER_SNIPPETS_BY_TAGS: {
      const tagExists = includes(action.payload.value, state.filter.tags);
      const tag = tagExists ? state.filter.tags : concat(state.filter.tags, action.payload.value);

      return flow([
        set(['filter', 'text'], ''),
        set(['filter', 'tags'], tag),
        set(['filter', 'language'], '')
      ])(state);
    }

    case AT.REMOVE_TAG_FROM_FILTER: {
      return set(['filter', 'tags'], without([action.payload.tag], state.filter.tags), state);
    }

    case AT.FILTER_SNIPPETS_BY_LANGUAGE: {
      return flow([
        set(['filter', 'text'], ''),
        set(['filter', 'tags'], []),
        set(['filter', 'language'], action.payload.value)
      ])(state);
    }

    case AT.CLEAR_FILTERS: {
      return flow([
        set(['filter', 'text'], ''),
        set(['filter', 'tags'], []),
        set(['filter', 'language'], '')
      ])(state);
    }

    case AT.SET_STAR.SUCCESS: {
      return flow([
        set(['starred'], concat([action.meta.id], state.starred)),
        set(['snippets', action.meta.id, 'star'], true)
      ])(state);
    }

    case AT.UNSET_STAR.SUCCESS: {
      return flow([
        set(['starred'], without([action.meta.id], state.starred)),
        set(['snippets', action.meta.id, 'star'], false)
      ])(state);
    }

    case AT.CREATE_SNIPPET.SUCCESS: {
      return set(
        ['snippets', action.payload.id],
        snippetStructure(action.payload, state.starred),
        state
      );
    }

    default: {
      return state;
    }
  }
};
