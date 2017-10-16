import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx-angular';
import { set, get, keyBy, merge, map, includes } from 'lodash/fp';
import {  } from 'lodash';

@Injectable()
export class GistsStore {
  @observable ui = {
    loading: false
  };
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
    gists.map(gist => gist.star = this.staredGists.indexOf(gist.id) !== -1);
    this.gists = keyBy('id', { ...gists });
  }

  @action setStarsOnGists(stared) {
    this.staredGists = stared.map(gist => gist.id);
  }

  @action setCurrentGist(result) {
    this.gists[result.id] = merge(this.gists[result.id], result);
    const gist = this.gists[result.id];
    // TODO: use only id and pull from pool of this.gists
    // TODO: extract all this pasta into util functions or pipes
    const regex = /#(\d*[A-Za-z_0-9]+\d*)/g;
    const description = gist.description;
    gist.tags = description.match(regex);
    gist.lastViewed = Math.floor(Date.now() / 1000);
    gist.description = gist.description.split('#')[0];
    this.current = merge(this.gists[result.id], gist);
  }
}
