import { trim } from 'lodash/fp';
import { TAG_REGEX } from 'constants/config';

export const removeTags = (string) => {
  if (!string)  return null;
  const tags = string.match(TAG_REGEX);

  return tags ? trim(string.split(tags[0])[0]) : string;
};
