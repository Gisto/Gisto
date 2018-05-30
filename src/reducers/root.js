import { combineReducers } from 'redux';

import { snippets } from 'reducers/snippets';
import { ui } from 'reducers/ui';
import { users } from 'reducers/users';

const reducers = {
  snippets,
  ui,
  users
};

const rootReducer =  combineReducers(reducers);

export default rootReducer;
