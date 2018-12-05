import * as AT from 'constants/actionTypes';

export const changeSettings = (key: string, value: string, isTheme = false, isBoolean = false) => ({
  meta: {
    key,
    value,
    isTheme,
    isBoolean
  },
  type: AT.CHANGE_SETTINGS,
  payload: {
    key,
    value
  }
});
