import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx-angular';
import { set, get, keyBy, merge, map, includes, isEmpty } from 'lodash/fp';

@Injectable()
export class GistsStore {
  @observable gists = {};
  @observable staredGists = [];
  @observable current = {};
  @observable filter = '';

  @computed get currentGist () {
    return this.current;
  }

  @computed get currentTimestamp () {
    return Math.floor(Date.now() / 1000);
  }

  @action setFilter(filter) {
    this.filter = filter;
  }

  processGist(gist) {
    gist.star = this.staredGists.indexOf(gist.id) !== -1;
    gist.lastViewed = Math.floor(Date.now() / 1000);

    if (!isEmpty(gist.description)) {
      const regex = /#(\d*[A-Za-z_0-9]+\d*)/g;
      const description = gist.description;
      gist.tags = description.match(regex);
      gist.description = gist.tags ? gist.description.split(gist.tags[0])[0] : gist.description;
      gist.lastUpdated = Math.floor(Date.now() / 1000);
    } else {
      gist.description = 'untitled';
    }

    return gist;
  }

  @action setGists(gists) {
    gists.map(gist => {
      this.processGist(gist);
    });
    this.gists = merge(keyBy('id', { ...gists }), this.gists);
  }

  @action setStarsOnGists(stared) {
    this.staredGists = stared.map(gist => gist.id);
  }

  @action setCurrentGist(result) {
    this.gists[result.id] = merge(this.gists[result.id], result);
    const gist = this.gists[result.id];
    this.processGist(gist);
    this.current = merge(this.gists[result.id], gist);
  }
}
