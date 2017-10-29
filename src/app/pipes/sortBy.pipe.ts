import { Pipe, PipeTransform } from '@angular/core';
import { sortBy, reverse, flow, identity } from 'lodash/fp';

@Pipe({ name: 'sortBy' })

export class SortByPipe implements PipeTransform {
  transform(list, field, direction = 'DESC') {

    return flow([
      sortBy([field]),
      direction === 'DESC' ? reverse : identity
    ])(list);
  }
}
