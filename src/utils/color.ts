export const hexToRGBA = (hex: string, alpha: number) => {
  const RR = parseInt(hex.slice(1, 3), 16);
  const GG = parseInt(hex.slice(3, 5), 16);
  const BB = parseInt(hex.slice(5, 7), 16);

  return `rgba(${RR}, ${GG}, ${BB}${alpha && `, ${alpha}`})`;
};
