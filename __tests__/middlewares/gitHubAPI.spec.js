import nock from 'nock';
import * as AT from 'constants/actionTypes';
import gitHubAPIMiddleware from 'middlewares/gitHubAPI';
import { DEFAULT_API_ENDPOINT_URL } from 'constants/config';

const createFakeStore = (initialState, dispatch = undefined) => ({
  dispatch,
  getState() {
    return initialState;
  }
});

const createMiddlewareDispatcher = (middleware) => async (
  storeData,
  action,
  dispatcher
) => {
  let dispatched = null;
  const dispatch = middleware(createFakeStore(storeData, dispatcher))(
    (actionAttempt) => (dispatched = actionAttempt)
  );

  await dispatch(action);

return dispatched;
};


describe('middleware - gitHubApi', () => {
  let dispatchSpy;

  let middlewareDispatcher = null;

  let initState;

  beforeEach(() => {
    dispatchSpy = jest.fn();
  });

  beforeAll(() => {
    initState = {
      rateLimit: {
        resources: {
          core: {
            limit: 5000,
            remaining: 4999,
            reset: 1372700873
          },
          search: {
            limit: 30,
            remaining: 18,
            reset: 1372697452
          }
        },
        rate: {
          limit: 5000,
          remaining: 4999,
          reset: 1372700873
        }
      }
    };
    middlewareDispatcher = createMiddlewareDispatcher(gitHubAPIMiddleware);
  });

  afterAll(() => {
    jest.resetModules();
  });

  test('dispatch called', () => {
    nock(DEFAULT_API_ENDPOINT_URL)
      .get('/rate_limit')
      .reply(200, { lala: 'fafa' });

    const action = {
      type: AT.GET_RATE_LIMIT
    };

    middlewareDispatcher(initState, action, dispatchSpy);

    expect(dispatchSpy)
      .toHaveBeenCalledWith({
        action: {
          type: {
            FAILURE: 'GET_RATE_LIMIT_FAILURE',
            PENDING: 'GET_RATE_LIMIT_PENDING',
            SUCCESS: 'GET_RATE_LIMIT_SUCCESS',
            type: 'GET_RATE_LIMIT'
          }
        },
        type: 'GET_RATE_LIMIT_PENDING'
      });
  });

  test('dispatch LOGOUT', () => {
    const action = {
      type: AT.LOGIN_BASIC
    };

    middlewareDispatcher(initState, action, dispatchSpy);

    expect(dispatchSpy)
      .toHaveBeenCalledWith({
        action: {
          type: {
            FAILURE: 'LOGIN_BASIC_FAILURE',
            PENDING: 'LOGIN_BASIC_PENDING',
            SUCCESS: 'LOGIN_BASIC_SUCCESS',
            type: 'LOGIN_BASIC'
          }
        },
        type: 'LOGIN_BASIC_PENDING'
      });
  });
});
