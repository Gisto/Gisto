import Color from 'color';

export const borderColor = '#ccc';
export const lightText = '#fff';
export const textColor = '#555';
export const baseAppColor = '#3F84A8';
export const colorRegular = baseAppColor;
export const colorDanger = 'tomato';
export const colorSuccess = 'cadetblue';
export const colorWarning = '#e0b01e';
export const colorInfo = '#1c93d2';
export const borderColorLight = borderColor;
export const headerColor = lightText;
export const headerBgLight = `rgba(${baseAppColor}, 0.5)`;
export const headerBgLightest = `rgba(${baseAppColor}, 0.1)`;
export const bg = Color(baseAppColor).lighten(0.95).string();
