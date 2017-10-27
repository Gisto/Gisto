import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cleanTags' })

export class CleanTagsPipe implements PipeTransform {
  transform(string) {
    const regex = /#(\d*[A-Za-z_0-9]+\d*)/g;
    const tags = string.match(regex);

    return tags ? string.split(tags[0])[0] : string;
  }
}
