import * as superagent from 'superagent';
import * as AT from 'constants/actionTypes';
import { getApiUrl } from 'utils/url';
import { responseHandler } from 'middlewares/helpers/responseHandler';
import { GITHUB_TOKEN_KEY_IN_STORAGE } from 'constants/config';

let API = superagent;

if (process.env.NODE_ENV === 'development') {
  // We use browser based superagent in dev in order to log to network tab instead of node streams
  // eslint-disable-next-line no-shadow, no-unused-vars
  API = require('superagent/dist/superagent');
}

const getToken = localStorage.getItem(GITHUB_TOKEN_KEY_IN_STORAGE);

const _headers = (additional) => ({
  'Content-Type': 'application/json',
  Authorization: `token ${getToken}`,
  ...additional
});

export const getSnippets = ({ action, dispatch }) => {
  dispatch({ type: AT.GET_SNIPPETS.PENDING, action });

  const sinceLastUpdate = action.payload.since ? `&since=${action.payload.since}` : '';
  const getGists = (page) =>
    API.get(`${getApiUrl('/api/v3')}/gists?page=${page}&per_page=100${sinceLastUpdate}`)
      .set(_headers())
      .end((error, result) => {
        responseHandler(error, result, dispatch, action);

        if (!error && result) {
          dispatch({
            type: AT.GET_SNIPPETS.SUCCESS,
            payload: result.body,
            meta: { since: action.payload.since }
          });
        }
        if (result.headers.link && result.headers.link.match(/next/gi)) {
          getGists(page + 1);
        }
      });

  getGists(1);
};

export const getSnippet = ({ action, dispatch }) => {
  dispatch({ type: AT.GET_SNIPPET.PENDING, action });

  return API.get(`${getApiUrl('/api/v3')}/gists/${action.payload.id}`)
    .set(_headers())
    .end((error, result) => {
      responseHandler(error, result, dispatch, action);
      const lastModified = result.headers['last-modified'] || '';

      if (!error && result) {
        dispatch({
          type: AT.GET_SNIPPET.SUCCESS,
          payload: { ...result.body, lastModified }
        });
      }
    });
};

export const updateSnippet = ({ action, dispatch }) => {
  dispatch({ type: AT.UPDATE_SNIPPET.PENDING, action });

  API.patch(`${getApiUrl('/api/v3')}/gists/${action.payload.id}`)
    .set(_headers())
    .send(action.payload.snippet)
    .end((error, result) => {
      responseHandler(error, result, dispatch, action);

      dispatch({
        type: AT.UPDATE_SNIPPET.SUCCESS,
        meta: action.meta,
        payload: result.body
      });
    });
};
