export const dateFormatToString = (string) => {
  const date = new Date(string);

  return date.toLocaleString();
};

export const toUnixTimeStamp = (date) => Math.floor(new Date(date).getTime() / 1000);

export const toISOString = (date) => {
  const rawDate = !date ? new Date() : date;

  return new Date(rawDate).toISOString();
};
