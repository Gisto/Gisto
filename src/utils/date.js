export const dateFormateToString = (string) => {
  const date = new Date(string);

  return date.toLocaleString();
};

export const toUnixTimeStamp = (date) => Math.floor(new Date(date).getTime() / 1000);
