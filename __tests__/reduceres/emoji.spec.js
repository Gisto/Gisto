import * as AT from 'constants/actionTypes';
import { emoji as reducer } from 'reducers/emoji';

const initialState = {
  emoji: {}
};

const payload = [{
  "smily": 'https//path.to.file'
}];

describe('reducer - emoji', () => {
  test('should return initial state', () => {
    const action = {
      type: ''
    };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  test('should return emojis', () => {
    const action = {
      type: AT.GET_EMOJI.SUCCESS,
      payload
    };
    const resultState = {
      emoji: payload
    };

    expect(reducer(initialState, action)).toEqual(resultState);
  });
});
