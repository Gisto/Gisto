import { Pipe, PipeTransform } from '@angular/core';
import { tagRegex as TAG_REGEX } from '../constants/config';

@Pipe({ name: 'cleanTags' })

export class CleanTagsPipe implements PipeTransform {
  transform(string) {
    if (!string)  return null;
    const tags = string.match(TAG_REGEX);

    return tags ? string.split(tags[0])[0] : string;
  }
}
