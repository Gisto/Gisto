import { TAG_REGEX } from 'constants/config';
import { trim } from 'lodash/fp';

export const removeTags = (title: string | undefined) => {
  if (!title) {
    return null;
  }

  const tags = title.match(TAG_REGEX);

  return tags ? trim(title.split(tags[0])[0]) : title;
};
