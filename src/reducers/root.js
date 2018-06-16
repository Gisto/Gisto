import { combineReducers } from 'redux';

import { snippets } from 'reducers/snippets';
import { ui } from 'reducers/ui';
import { users } from 'reducers/users';
import { login } from 'reducers/login';

const reducers = {
  snippets,
  ui,
  users,
  login
};

const rootReducer = combineReducers(reducers);

export default rootReducer;
