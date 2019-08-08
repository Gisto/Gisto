import * as superagent from 'superagent';
import * as AT from 'constants/actionTypes';
import { responseHandler } from 'middlewares/helpers/responseHandler';
import { GITLAB_TOKEN_KEY_IN_STORAGE } from 'constants/config';

let API = superagent;

if (process.env.NODE_ENV === 'development') {
  // We use browser based superagent in dev in order to log to network tab instead of node streams
  // eslint-disable-next-line no-shadow, no-unused-vars
  API = require('superagent/dist/superagent');
}

const getApiUrl = 'https://gitlab.com/api/v4';
const getToken = localStorage.getItem(GITLAB_TOKEN_KEY_IN_STORAGE);

const _headers = (additional) => ({
  'Content-Type': 'application/json',
  'PRIVATE-TOKEN': getToken,
  ...additional
});

export const getSnippets = ({ action, dispatch }) => {
  dispatch({ type: AT.GET_SNIPPETS.PENDING, action });

  API.get(`${getApiUrl}/snippets`)
    .set(_headers())
    .end((error, result) => {
      responseHandler(error, result, dispatch, action);

      if (!error && result) {
        dispatch({
          type: AT.GET_SNIPPETS.SUCCESS,
          payload: result.body,
          meta: {}
        });
      }
    });
};

export const getSnippet = ({ action, dispatch }) => {
  dispatch({ type: AT.GET_SNIPPET.PENDING, action });

  return API.get(`${getApiUrl}/snippets/${action.payload.id}/raw`)
    .set(_headers())
    .end((error, result) => {
      responseHandler(error, result, dispatch, action);
      if (!error && result) {
        dispatch({
          type: AT.GET_SNIPPET.SUCCESS,
          meta: { service: 'GITLAB' },
          payload: { content: result.text, id: action.payload.id }
        });
      }
    });
};

export const updateSnippet = ({ action, dispatch }) => {
  dispatch({ type: AT.UPDATE_SNIPPET.PENDING, action });

  const { description: title } = action.payload.snippet;
  const file = action.payload.snippet.files[Object.keys(action.payload.snippet.files)];
  // eslint-disable-next-line camelcase
  const { content, filename: file_name } = file;

  API.put(`${getApiUrl}/snippets/${action.payload.id}`)
    .set(_headers())
    .send(JSON.stringify({ content, title, file_name }))
    .end((error, result) => {
      responseHandler(error, result, dispatch, action);

      dispatch({
        type: AT.UPDATE_SNIPPET.SUCCESS,
        meta: action.meta,
        payload: result.body
      });
    });
};
