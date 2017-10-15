import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchFilter' })

export class GistSearchPipe implements PipeTransform {
  transform(gists, string) {
    return gists.filter(gist => gist.description.match(string));
  }
}
