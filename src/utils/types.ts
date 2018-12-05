export const handleTypes = (item: string) => {
  if (item === 'true') {
    return true;
  }
  if (item === 'false') {
    return false;
  }

  return item;
};
