export const dateFormatToString = (str: string) => {
  const date = new Date(str);

  return date.toLocaleString();
};

export const toUnixTimeStamp = (date: number): number =>
  Math.floor(new Date(date).getTime() / 1000);

export const toISOString = (date: string) => {
  const rawDate = !date ? new Date() : date;

  return new Date(rawDate).toISOString();
};
