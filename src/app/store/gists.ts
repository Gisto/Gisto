import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx-angular';
import { set, get, keyBy, merge, map, includes, isEmpty, omit } from 'lodash/fp';

@Injectable()
export class GistsStore {

  @observable gists = {};
  @observable staredGists = [];
  @observable current = <any>{};
  @observable localEdit = <any>{};
  @observable filter = '';

  processGist(gist) {
    gist.star = false;
    gist.star = this.staredGists.findIndex(id => gist.id === id) !== -1;
    gist.lastViewed = Math.floor(Date.now() / 1000);

    if (!isEmpty(gist.description)) {
      const regex = /#(\d*[A-Za-z_0-9]+\d*)/g;
      const description = gist.description;
      gist.tags = description.match(regex);
    } else {
      gist.description = 'untitled';
    }

    return gist;
  }

  @computed get currentGist () {
    return this.current;
  }

  @computed get currentTimestamp () {
    return Math.floor(Date.now() / 1000);
  }

  @action setFilter(filter) {
    this.filter = filter;
  }


  @action changeLocalDataDescription(description) {
    this.setLocalData(this.currentGist.id);
    this.localEdit.description = description;
  }

  @action changeLocalDataFile(filename, value) {
    this.setLocalData(this.currentGist.id);
    this.localEdit.files[filename] = {
      filename: value,
      content: this.localEdit.files[filename].content
    };
  }

  @action changeLocalDataContent(filename, value) {
    this.setLocalData(this.currentGist.id);
    this.localEdit.files[filename] = {
      filename: this.localEdit.files[filename].filename,
      content: value
    };
  }

  @action setLocalData(id) {
    if (Object.keys(this.localEdit).length === 0) {
      this.localEdit = {
        description: this.gists[id].description,
        files: this.gists[id].files
      };
    }
  }

  @action clearLocalData() {
    this.localEdit = {};
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

  @action setCurrentGist(result, proccess = false) {
    this.gists[result.id] = merge(this.gists[result.id], result);
    const gist = this.gists[result.id];
    if (proccess) {
      this.processGist(gist);
    }
    this.current = gist;
  }

  @action expandCollapseFile(gistId, file) {
    this.gists[gistId].files[file].collapsed = !this.gists[gistId].files[file].collapsed;
  }

  @action star(id) {
    this.gists[id].star = true;
    this.setCurrentGist(this.gists[id], false);
  }

  @action unStar(id) {
    this.gists[id].star = false;
    this.setCurrentGist(this.gists[id], false);
  }

  @action deleteGist(id) {
    delete this.gists[id];
    this.setGists(this.gists);
  }
}
