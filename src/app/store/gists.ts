import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx-angular';

@Injectable()
export class GistsStore {
  @observable gists = [];
  @observable current = {};

  @computed get currentGist () {
    return this.current;
  };

  @action setCurrentGist(gist) {
    const regex = /#(\d*[A-Za-z_0-9]+\d*)/g;
    const description = gist.description;
    gist.tags = description.match(regex);
    gist.description = gist.description.split('#')[0];
    this.current = gist;
  }

}
