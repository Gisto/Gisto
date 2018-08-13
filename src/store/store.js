import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from 'reducers/root';

import gitHubAPIMiddleware from 'middlewares/gitHubAPI';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(rootReducer, composeEnhancers(applyMiddleware(gitHubAPIMiddleware)));

window.store = store;

export default store;
