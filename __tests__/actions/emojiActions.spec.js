import * as AT from 'constants/actionTypes';
import * as emojiActions from 'actions/emoji';

describe('ACTIONS - emoji', () => {
  test('getEmoji action should be created', () => {
    expect(emojiActions.getEmoji()).toEqual({ type: AT.GET_EMOJI });
  });
});
