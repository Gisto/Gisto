import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'lodash/fp';

@Pipe({ name: 'searchFilter' })

export class GistSearchPipe implements PipeTransform {
  transform(gists, string) {
    if (!string) {
      return gists;
    }

    return filter(gist => gist.description.match(string), gists);
  }
}
