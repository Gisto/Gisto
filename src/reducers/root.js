import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { snippets } from 'reducers/snippets';
import { ui } from 'reducers/ui';
import { users } from 'reducers/users';
import { login } from 'reducers/login';
import { emoji } from 'reducers/emoji';

const reducers = {
  snippets,
  ui,
  users,
  login,
  emoji
};

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    ...reducers
  });

export default rootReducer;
