import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx-angular';
import { set, get, keyBy, merge, map, includes } from 'lodash/fp';

@Injectable()
export class GistsStore {
  @observable gists = {};
  @observable staredGists = [];
  @observable current = {};
  @observable filter = '';

  @computed get currentGist () {
    return this.current;
  }

  @action setFilter(filter) {
    this.filter = filter;
  }

  @action setGists(gists) {
    gists.map(gist => gist.star = includes(gist.id, this.staredGists));
    this.gists = keyBy('id', { ...gists });
  }

  @action setStarsOnGists(stared) {
    this.staredGists.push(stared.map(gist => gist.id));
  }

  @action setCurrentGist(result) {
    this.gists[result.id] = result;
    const gist = this.gists[result.id];
    // TODO: use only id and pull from pool of this.gists
    // TODO: extract all this pasta into util functions or pipes
    const regex = /#(\d*[A-Za-z_0-9]+\d*)/g;
    const description = gist.description;
    gist.tags = description.match(regex);
    gist.description = gist.description.split('#')[0];
    this.current = merge(gist, get(result.id, this.gists));
  }
}
