import { tagRegex } from 'constants/config';

export const removeTags = (string) => {
  if (!string)  return null;
  const tags = string.match(tagRegex);

  return tags ? string.split(tags[0])[0] : string;
};
