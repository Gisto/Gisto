import { getSetting } from 'utils/settings';
import { tint } from 'polished';

export const tintBackground = (color) => tint(0.90, color);
export const tintHeaderBgLightest = (color) => tint(0.75, color);

export const theme = {
  baseAppColor: getSetting('color', '#3F84A8'),
  borderColor: '#ccc',
  disabledColor: '#ccc',
  lightBorderColor: '#f2f2f2',
  lightText: '#fff',
  textColor: '#555',
  boxShadow: '#555',
  colorDanger: 'tomato',
  colorSuccess: 'cadetblue',
  colorWarning: '#e0b01e',
  headerColor: '#fff',
  headerBgLightest: tintHeaderBgLightest(getSetting('color', '#3F84A8')),
  bg: tintBackground(getSetting('color', '#3F84A8'))
};
