export const dateFormateToString = (string) => {
  const date = new Date(string);

  return date.toLocaleString();
};
