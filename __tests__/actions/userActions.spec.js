import * as AT from 'constants/actionTypes';
import * as userActions from 'actions/user';

describe('ACTIONS - user', () => {
  test('getUser action should be created', () => {
    expect(userActions.getUser()).toEqual({ type: AT.GET_USER });
  });
});
