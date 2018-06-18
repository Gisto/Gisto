import * as API from 'superagent';
import * as AT from 'constants/actionTypes';
import { DEFAULT_API_ENDPOINT_URL, gitHubTokenKeyInStorage } from 'constants/config';
import { setNotification } from 'utils/notifications';
import { setToken, removeToken } from 'utils/login';
import { get, set } from 'lodash/fp';

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
        setNotification(`ERROR: ${error.status}: ${error.response.message} ${error.response.body.message}`);
      } else if (result.statusCode > 204) {
        setNotification(`INFO: ${result.statusText} - ${result.body.description}`);
      }

      dispatch({
        type: `${action.type}_FAILURE`,
        payload: error
      });
    };

    if (action.type === AT.GET_RATE_LIMIT) {
      dispatch({ type: AT.GET_RATE_LIMIT.PENDING, action });
      API.get(`${DEFAULT_API_ENDPOINT_URL}/rate_limit`)
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
      window.location.reload(true);
    }

    if (action.type === AT.LOGIN_BASIC) {
      dispatch({ type: AT.LOGIN_BASIC.PENDING, action });
      const tokenString = btoa(`${action.payload.user}:${action.payload.pass}`);
      let basicAuthHeader = {
        Authorization: `basic ${tokenString}`
      };

      if (action.payload.twoFactorAuth) {
        basicAuthHeader = set('X-GitHub-OTP', action.payload.twoFactorAuth, basicAuthHeader);
      }

      API.post(`${DEFAULT_API_ENDPOINT_URL}/authorizations`)
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
      API.get(`${DEFAULT_API_ENDPOINT_URL}/user`)
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
      API.get(`${DEFAULT_API_ENDPOINT_URL}/user`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          if (!error && result) {
            dispatch({ type: AT.GET_USER.SUCCESS, payload: result.body });
          }
        });
    }

    if (action.type === AT.GET_STARRED_SNIPPETS) {
      dispatch({ type: AT.GET_STARRED_SNIPPETS.PENDING, action });

      return API.get(`${DEFAULT_API_ENDPOINT_URL}/gists/starred`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          dispatch({ type: AT.GET_STARRED_SNIPPETS.SUCCESS, payload: result.body });
        });
    }

    if (action.type === AT.GET_SNIPPETS) {
      dispatch({ type: AT.GET_SNIPPETS.PENDING, action });

      const getGists = (page) => API.get(`${DEFAULT_API_ENDPOINT_URL}/gists?page=${page}&per_page=100`)
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

      return API.get(`${DEFAULT_API_ENDPOINT_URL}/gists/${action.payload.id}`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          if (!error && result) {
            dispatch({
              type: AT.GET_SNIPPET.SUCCESS,
              payload: result.body
            });
          }
        });
    }

    if (action.type === AT.SET_STAR) {
      dispatch({ type: AT.SET_STAR.PENDING, action });

      return API.put(`${DEFAULT_API_ENDPOINT_URL}/gists/${action.payload.id}/star`)
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

      return API.delete(`${DEFAULT_API_ENDPOINT_URL}/gists/${action.payload.id}/star`)
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
      API.post(`${DEFAULT_API_ENDPOINT_URL}/gists`)
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
          }
        });
    }

    if (action.type === AT.DELETE_SNIPPET) {
      dispatch({ type: AT.DELETE_SNIPPET.PENDING, action });
      API.delete(`${DEFAULT_API_ENDPOINT_URL}/gists/${action.payload.id}`)
        .set(_headers())
        .end((error, result) => {
          errorHandler(error, result);

          if (result.statusCode === 204) {
            dispatch({
              type: AT.DELETE_SNIPPET.SUCCESS,
              meta: action.meta
            });
          }
        });
    }

    if (action.type === AT.UPDATE_SNIPPET) {
      dispatch({ type: AT.UPDATE_SNIPPET.PENDING, action });

      API.patch(`${DEFAULT_API_ENDPOINT_URL}/gists/${action.payload.id}`)
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

    next(action);
  };
};

export default gitHubAPIMiddleware;
