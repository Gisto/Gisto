import {
  merge,
  keyBy,
  update,
  set,
  map,
  flow,
  concat,
  includes,
  without,
  omit,
  pick,
  get,
  filter,
  findIndex
} from 'lodash/fp';
import uuid from 'uuid';
import * as AT from 'constants/actionTypes';
import { snippetStructure } from 'utils/prepareSnippet';
import { toISOString } from 'utils/date';

const initialState = {
  snippets: {},
  starred: [],
  filter: {
    text: '',
    tags: [],
    language: '',
    status: '',
    truncated: false,
    untagged: false
  },
  comments: {},
  lastOpenedId: null,
  lastUpdated: null,
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
      const lastUpdated = state.lastUpdated === null ? toISOString() : state.lastUpdated;

      return flow([
        update('snippets', () =>
          merge(
            keyBy('id', map((snippet) => snippetStructure(snippet, state.starred), action.payload)),
            state.snippets
          )
        ),
        set('lastUpdated', lastUpdated)
      ])(state);
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
        set(['filter', 'language'], ''),
        set(['filter', 'status'], ''),
        set(['filter', 'untagged'], false),
        set(['filter', 'truncated'], false)
      ])(state);
    }

    case AT.FILTER_SNIPPETS_BY_TAGS: {
      const tagExists = includes(action.payload.value, state.filter.tags);
      const tag = tagExists ? state.filter.tags : concat(state.filter.tags, action.payload.value);

      return flow([
        set(['filter', 'text'], ''),
        set(['filter', 'tags'], tag),
        set(['filter', 'language'], ''),
        set(['filter', 'status'], ''),
        set(['filter', 'untagged'], false),
        set(['filter', 'truncated'], false)
      ])(state);
    }

    case AT.REMOVE_TAG_FROM_FILTER: {
      return set(['filter', 'tags'], without([action.payload.tag], state.filter.tags), state);
    }

    case AT.FILTER_SNIPPETS_BY_LANGUAGE: {
      return flow([
        set(['filter', 'text'], ''),
        set(['filter', 'tags'], []),
        set(['filter', 'language'], action.payload.value),
        set(['filter', 'status'], ''),
        set(['filter', 'untagged'], false),
        set(['filter', 'truncated'], false)
      ])(state);
    }

    case AT.FILTER_SNIPPETS_BY_STATUS: {
      return flow([
        set(['filter', 'text'], ''),
        set(['filter', 'tags'], []),
        set(['filter', 'language'], ''),
        set(['filter', 'status'], action.payload.status),
        set(['filter', 'untagged'], false),
        set(['filter', 'truncated'], false)
      ])(state);
    }

    case AT.FILTER_SNIPPETS_BY_TRUNCATED: {
      return flow([
        set(['filter', 'text'], ''),
        set(['filter', 'tags'], []),
        set(['filter', 'language'], ''),
        set(['filter', 'status'], ''),
        set(['filter', 'untagged'], false),
        set(['filter', 'truncated'], true)
      ])(state);
    }

    case AT.FILTER_SNIPPETS_BY_UNTAGGED: {
      return flow([
        set(['filter', 'text'], ''),
        set(['filter', 'tags'], []),
        set(['filter', 'language'], ''),
        set(['filter', 'status'], ''),
        set(['filter', 'untagged'], true),
        set(['filter', 'truncated'], false)
      ])(state);
    }

    case AT.CLEAR_FILTERS: {
      return flow([
        set(['filter', 'text'], ''),
        set(['filter', 'tags'], []),
        set(['filter', 'language'], ''),
        set(['filter', 'status'], ''),
        set(['filter', 'untagged'], false),
        set(['filter', 'truncated'], false)
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

    case AT.DELETE_SNIPPET.SUCCESS: {
      return flow([
        set(['starred'], without([action.meta.id], state.starred)),
        omit([['snippets', action.meta.id]])
      ])(state);
    }

    case AT.START_EDIT_SNIPPET: {
      const description = get(['rawDescription'], state.snippets[action.payload.id]);
      const files = pick(['files'], state.snippets[action.payload.id]);
      const preparedFiles = map(
        (file) => ({
          uuid: uuid.v4(),
          originalFileName: file.filename,
          ...file,
          collapsed: false
        }),
        files.files
      );

      return flow([
        set(['edit', 'description'], description),
        set(['edit', 'files'], keyBy('uuid', preparedFiles))
      ])(state);
    }

    case AT.ADD_TEMP_FILE: {
      const existingFiles = get(['edit', 'files'], state);
      const newUuid = uuid.v4();
      const newFile = {
        [newUuid]: {
          uuid: newUuid,
          isNew: true,
          originalFileName: action.payload.fileName ? action.payload.fileName : newUuid,
          filename: action.payload.fileName ? action.payload.fileName : 'file',
          content: action.payload.fileContent ? action.payload.fileContent : ' ',
          collapsed: false
        }
      };

      return set(['edit', 'files'], merge(newFile, existingFiles || {}), state);
    }

    case AT.STOP_EDIT_SNIPPET: {
      return set('edit', {}, state);
    }

    case AT.UPDATE_TEMP_SNIPPET: {
      let updatePath;
      const { path, value } = action.payload;

      if (Array.isArray(path)) {
        updatePath = concat(['edit'], path);
      } else {
        updatePath = ['edit', path];
      }

      return set(updatePath, value, state);
    }

    case AT.DELETE_TEMP_FILE: {
      return set(['edit', 'files', action.payload.uuid, 'delete'], true, state);
    }

    case AT.UPDATE_SNIPPET.SUCCESS: {
      return flow([
        set('edit', {}),
        set(['snippets', action.payload.id], snippetStructure(action.payload, state.starred))
      ])(state);
    }

    case AT.GET_SNIPPET_COMMENTS.SUCCESS: {
      return set(['comments', action.meta.id], action.payload, state);
    }

    case AT.GET_SNIPPET_COMMENTS.PENDING: {
      return set(['comments', action.meta.id], [], state);
    }

    case AT.CREATE_SNIPPET_COMMENT.SUCCESS: {
      return set(
        ['comments', action.meta.id],
        concat(get(['comments', action.meta.id], state), action.payload),
        state
      );
    }

    case AT.DELETE_COMMENT.SUCCESS: {
      const comments = filter((comment) => {
        return comment.id !== action.meta.commentId;
      }, get(['comments', action.meta.id], state));

      return set(['comments', action.meta.id], comments, state);
    }

    case AT.TOGGLE_FILE_COLLAPSE: {
      const snippet = get(['snippets', action.payload.snippetId, 'files'], state);
      const fileIndex = findIndex({ filename: action.payload.fileName }, snippet);
      const isCollapsed = get(
        ['snippets', action.payload.snippetId, 'files', [fileIndex], 'collapsed'],
        state
      );

      return set(
        ['snippets', action.payload.snippetId, 'files', [fileIndex], 'collapsed'],
        !isCollapsed,
        state
      );
    }

    default: {
      return state;
    }
  }
};
