import { createStore, applyMiddleware, compose } from 'redux';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from 'reducers/root';
import gitHubAPIMiddleware from 'middlewares/gitHubAPI';

export const history = createHashHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [routerMiddleware(history), gitHubAPIMiddleware];

if (process.env.NODE_ENV === 'development') {
  const freeze = require('redux-freeze');

  // const { createLogger } = require('redux-logger');
  // const logger = createLogger({ collapsed: true });

  const middlewaresToAdd = [
    freeze
    // logger
  ];

  middlewares.push(...middlewaresToAdd);
}

const store = createStore(
  createRootReducer(history),
  composeEnhancers(applyMiddleware(...middlewares))
);

export default store;
