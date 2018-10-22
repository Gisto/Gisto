import { getSetting } from 'utils/settings';
import { tint } from 'polished';

export const baseAppColor = getSetting('color', '#3F84A8');
export const borderColor = '#ccc';
export const disabledColor = borderColor;
export const lightBorderColor = '#f2f2f2';
export const lightText = '#fff';
export const textColor = '#555';
export const boxShadow = textColor;
export const colorDanger = 'tomato';
export const colorSuccess = 'cadetblue';
export const colorWarning = '#e0b01e';
export const headerColor = lightText;
export const headerBgLightest = tint(0.25, baseAppColor);
export const bg = tint(0.10, baseAppColor);

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
  headerBgLightest: tint(0.25, getSetting('color', '#3F84A8')),
  bg: tint(0.10, getSetting('color', '#3F84A8'))
};
