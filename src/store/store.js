import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from 'reducers/root';
import createHistory from 'history/createHashHistory';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import gitHubAPIMiddleware from 'middlewares/gitHubAPI';

export const history = createHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [
  routerMiddleware(history),
  gitHubAPIMiddleware
];

const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancers(applyMiddleware(...middlewares))
);

export default store;
