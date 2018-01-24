import { Pipe, PipeTransform } from '@angular/core';
import { filter, includes } from 'lodash/fp';

@Pipe({ name: 'searchFilter' })

export class GistSearchPipe implements PipeTransform {
  transform(snippets, needle, type = 'freeText') {
    if (!needle) {
      return snippets;
    }

    if (type === 'freeText') {
      return filter((snippet) => snippet.description.match(needle) || includes(needle, snippet.languages), snippets);
    }

    if (type === 'fileType') {
      return filter((snippet) => includes(needle, snippet.languages), snippets);
    }

    return snippets;
  }
}
