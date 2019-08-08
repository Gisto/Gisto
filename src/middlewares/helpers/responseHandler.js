import { setNotification } from 'utils/notifications';
import { removeEnterpriseDomain, removeToken } from 'utils/login';
import { getOr } from 'lodash/fp';
import * as AT from 'constants/actionTypes';

export const responseHandler = (error, result, dispatch, action) => {
  if (error) {
    if (error.response && error.response.headers['x-github-otp']) {
      setNotification({
        title: 'Two factor authentication',
        body: `${error.response.body.message}`,
        type: 'info'
      });
    } else if (error.status === 401) {
      setNotification({
        title: 'Log-in required',
        body: `${error.response.body.message}`,
        type: 'error'
      });

      removeToken();
      removeEnterpriseDomain();
      window.location.reload(true);
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
  } else {
    dispatch({
      type: AT.GET_RATE_LIMIT.SUCCESS,
      payload: {
        rate: {
          limit: result.headers['x-ratelimit-limit'],
          remaining: result.headers['x-ratelimit-remaining'],
          reset: result.headers['x-ratelimit-reset']
        }
      }
    });
  }
};
