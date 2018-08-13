import * as AT from 'constants/actionTypes';
import { users as reducer } from 'reducers/users';

const initialState = {
  user: {}
};

describe('reducer - users', () => {
  test('should return initial state', () => {
    const action = {
      type: ''
    };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  test('should return users data populated state', () => {
    const action = {
      type: AT.GET_USER.SUCCESS,
      payload: {
        login: 'username'
      }
    };
    const resultState = {
      user: {
        login: 'username'
      }
    };

    expect(reducer(initialState, action)).toEqual(resultState);
  });
});
