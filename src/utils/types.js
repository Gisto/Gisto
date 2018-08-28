export const handleTypes = (item) => {
  if (item === 'true') {
    return true;
  }
  if (item === 'false') {
    return false;
  }

  return item;
};
