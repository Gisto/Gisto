import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx-angular';
import { set, keyBy, merge, map } from 'lodash/fp';

@Injectable()
export class GistsStore {
  @observable gists = {};
  @observable current = {};

  @computed get currentGist () {
    return this.current;
  }

  @action setGists(gists) {
    this.gists = keyBy('id', { ...gists });
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
    this.current = gist;
  }
}
