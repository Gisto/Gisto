import { slice } from 'lodash/fp';

export const hexToRGBA = (hex: string, alpha: number) => {
  if (!alpha) {
    return hex;
  }
  // @ts-ignore
  const RR = parseInt(slice(1, 3, hex), 16);
  // @ts-ignore
  const GG = parseInt(slice(3, 5, hex), 16);
  // @ts-ignore
  const BB = parseInt(slice(5, 7, hex), 16);

  return `rgba(${RR}, ${GG}, ${BB}, ${alpha})`;
};
