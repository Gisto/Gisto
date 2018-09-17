/* eslint consistent-return: 0 */

import * as superagent from 'superagent';
import * as AT from 'constants/actionTypes';
import { gitHubTokenKeyInStorage } from 'constants/config';
import { setNotification } from 'utils/notifications';
import { getApiUrl } from 'utils/url';
import { setToken, removeToken, removeEnterpriseDomain } from 'utils/login';
import { get, getOr, set } from 'lodash/fp';
import { push } from 'connected-react-router';

let API = superagent;

if (process.env.NODE_ENV === 'development') {
  // We use browser based superagent in dev in order to log to network tab instead of node streams
  // eslint-disable-next-line no-shadow, no-unused-vars
  API = require('superagent/superagent');
}
const getToken = localStorage.getItem(gitHubTokenKeyInStorage);

const _headers = (additional) => ({
  'Content-Type': 'application/json',
  Authorization: `token ${getToken}`,
  ...additional
});

const gitHubAPIMiddleware = ({ dispatch }) => {
  return (next) => (action) => {
    const errorHandler = (error, result) => {
      if (error) {
        if (error.response && error.response.headers['x-github-otp']) {
          setNotification({
            title: 'Two factor authentication',
            body: `${error.response.body.message}`,
            type: 'info'
          });
        } else {
          setNotification({
            title: 'Error',
            body: `
              ${error.response.body.message} ${getOr('', 'response.body.errors[0].message', error)}
              <br/>
              <small>Error code: ${error.status}</small>
            `,
            type: 'error'
          });
        }

        dispatch({
          type: action.type.FAILURE,
          payload: error,
          meta: action.meta
        });
      } else if (result.statusCode > 204) {
        setNotification({
          title: 'Warning',
          body: `${result.statusText} - ${result.body.description}`,
          type: 'warn'
        });
      }
    };

    if (action.type === AT.GET_RATE_LIMIT) {
      dispatch({ type: AT.GET_RATE_LIMIT.PENDING, action });
      API.get(`${getApiUrl('/api/v3')}/rate_limit`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          if (!error && result) {
            dispatch({ type: AT.GET_RATE_LIMIT.SUCCESS, payload: result.body });
          }
        });
    }

    if (action.type === AT.LOGOUT) {
      removeToken();
      removeEnterpriseDomain();
      window.location.reload(true);
    }

    if (action.type === AT.LOGIN_BASIC) {
      dispatch({ type: AT.LOGIN_BASIC.PENDING, action });
      const tokenString = btoa(`${action.payload.user}:${action.payload.pass}`);
      let basicAuthHeader = {
        Authorization: `basic ${tokenString}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };

      if (action.payload.twoFactorAuth) {
        basicAuthHeader = set('X-GitHub-OTP', action.payload.twoFactorAuth, basicAuthHeader);
      }

      API.post(`${getApiUrl('/api/v3')}/authorizations`)
        .set(basicAuthHeader)
        .send(JSON.stringify({
          scopes: ['gist'],
          note: 'Gisto - Snippets made simple',
          note_url: 'http://www.gistoapp.com',
          fingerprint: new Date().getTime()
        }))
        .end((error, result) => {
          errorHandler(error, result);

          // check if 2fa needed and notify the ui to show the field
          if (result.statusCode === 401 && result.header['x-github-otp']) {
            dispatch({ type: AT.LOGIN_BASIC_REQUEST_2FA });
          }

          if (!error && result) {
            const token = get('token', result.body);

            if (token) {
              setToken(token);
              dispatch({ type: AT.LOGIN_BASIC.SUCCESS, payload: result.body });
              window.location.reload(true);
            }
          }
        });
    }

    if (action.type === AT.LOGIN_WITH_TOKEN) {
      dispatch({ type: AT.LOGIN_WITH_TOKEN.PENDING, action });
      API.get(`${getApiUrl('/api/v3')}/user`)
        .set({ Authorization: `token ${action.payload.token}` })
        .end((error, result) => {
          errorHandler(error, result);
          if (result.statusCode === 200) {
            setToken(action.payload.token);

            window.location.reload(true);
          }
        });
    }

    if (action.type === AT.GET_USER) {
      dispatch({ type: AT.GET_USER.PENDING, action });
      API.get(`${getApiUrl('/api/v3')}/user`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          if (!error && result) {
            dispatch({ type: AT.GET_USER.SUCCESS, payload: result.body });
          }
        });
    }

    if (action.type === AT.GET_EMOJI) {
      dispatch({ type: AT.GET_EMOJI.PENDING, action });
      API.get(`${getApiUrl('/api/v3')}/emojis`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          if (!error && result) {
            dispatch({ type: AT.GET_EMOJI.SUCCESS, payload: result.body });
          }
        });
    }

    if (action.type === AT.GET_STARRED_SNIPPETS) {
      dispatch({ type: AT.GET_STARRED_SNIPPETS.PENDING, action });

      return API.get(`${getApiUrl('/api/v3')}/gists/starred`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          dispatch({ type: AT.GET_STARRED_SNIPPETS.SUCCESS, payload: result.body });
        });
    }

    if (action.type === AT.GET_SNIPPETS) {
      dispatch({ type: AT.GET_SNIPPETS.PENDING, action });

      const getGists = (page) => API.get(`${getApiUrl('/api/v3')}/gists?page=${page}&per_page=100`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          if (!error && result) {
            dispatch({
              type: AT.GET_SNIPPETS.SUCCESS,
              payload: result.body
            });
          }
          if (result.headers.link && result.headers.link.match(/next/ig)) {
            getGists(page + 1);
          }
        });

      getGists(1);
    }

    if (action.type === AT.GET_SNIPPET) {
      dispatch({ type: AT.GET_SNIPPET.PENDING, action });

      return API.get(`${getApiUrl('/api/v3')}/gists/${action.payload.id}`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);
          const lastModified = result.headers['last-modified'] || '';

          if (!error && result) {
            dispatch({
              type: AT.GET_SNIPPET.SUCCESS,
              payload: { ...result.body, lastModified }
            });
          }
        });
    }

    if (action.type === AT.SET_STAR) {
      dispatch({ type: AT.SET_STAR.PENDING, action });

      return API.put(`${getApiUrl('/api/v3')}/gists/${action.payload.id}/star`)
        .set(_headers({ 'Content-Length': 0 }))
        .end((error, result) => {
          errorHandler(error, result);

          if (error || result.status !== 204) {
            dispatch({
              type: AT.SET_STAR.FAILURE,
              payload: error
            });
          }

          if (!error && result.status === 204) {
            dispatch({
              type: AT.SET_STAR.SUCCESS,
              meta: action.meta
            });
          }
        });
    }

    if (action.type === AT.UNSET_STAR) {
      dispatch({ type: AT.UNSET_STAR.PENDING, action });

      return API.delete(`${getApiUrl('/api/v3')}/gists/${action.payload.id}/star`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          if (error || result.status !== 204) {
            dispatch({
              type: AT.UNSET_STAR.FAILURE,
              payload: error
            });
          }

          if (!error && result.status === 204) {
            dispatch({
              type: AT.UNSET_STAR.SUCCESS,
              meta: action.meta
            });
          }
        });
    }

    if (action.type === AT.CREATE_SNIPPET) {
      dispatch({ type: AT.CREATE_SNIPPET.PENDING, action });
      API.post(`${getApiUrl('/api/v3')}/gists`)
        .set(_headers())
        .send(JSON.stringify(action.payload))
        .end((error, result) => {
          errorHandler(error, result);

          if (result.statusCode === 201) {
            dispatch({
              type: AT.CREATE_SNIPPET.SUCCESS,
              meta: action.meta,
              payload: result.body
            });

            dispatch(push(`/snippet/${result.body.id}`));
          }
        });
    }

    if (action.type === AT.DELETE_SNIPPET) {
      dispatch({ type: AT.DELETE_SNIPPET.PENDING, action });
      API.delete(`${getApiUrl('/api/v3')}/gists/${action.payload.id}`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          if (result.statusCode === 204) {
            dispatch({
              type: AT.DELETE_SNIPPET.SUCCESS,
              meta: action.meta
            });

            dispatch(push('/'));
          }
        });
    }

    if (action.type === AT.UPDATE_SNIPPET) {
      dispatch({ type: AT.UPDATE_SNIPPET.PENDING, action });

      API.patch(`${getApiUrl('/api/v3')}/gists/${action.payload.id}`)
        .set(_headers())
        .send(action.payload.snippet)
        .end((error, result) => {
          errorHandler(error, result);

          dispatch({
            type: AT.UPDATE_SNIPPET.SUCCESS,
            meta: action.meta,
            payload: result.body
          });
        });
    }

    if (action.type === AT.GET_SNIPPET_COMMENTS) {
      dispatch({ type: AT.GET_SNIPPET_COMMENTS.PENDING, meta: action.meta });
      API.get(`${getApiUrl('/api/v3')}/gists/${action.payload.id}/comments`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          if (!error && result) {
            dispatch({
              type: AT.GET_SNIPPET_COMMENTS.SUCCESS,
              payload: result.body,
              meta: action.meta
            });
          }
        });
    }

    if (action.type === AT.CREATE_SNIPPET_COMMENT) {
      dispatch({ type: AT.CREATE_SNIPPET_COMMENT.PENDING, action });
      API.post(`${getApiUrl('/api/v3')}/gists/${action.payload.id}/comments`)
        .set(_headers())
        .send({ body: action.payload.body })
        .end((error, result) => {
          errorHandler(error, result);

          if (!error && result) {
            dispatch({
              type: AT.CREATE_SNIPPET_COMMENT.SUCCESS,
              payload: result.body,
              meta: action.meta
            });
          }
        });
    }

    if (action.type === AT.DELETE_COMMENT) {
      dispatch({ type: AT.DELETE_COMMENT.PENDING, action });
      API.delete(`${getApiUrl('/api/v3')}/gists/${action.payload.id}/comments/${action.payload.commentId}`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          if (result.statusCode === 204) {
            dispatch({
              type: AT.DELETE_COMMENT.SUCCESS,
              meta: action.meta
            });
          }
        });
    }

    next(action);
  };
};

export default gitHubAPIMiddleware;
