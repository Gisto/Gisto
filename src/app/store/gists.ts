import { Injectable } from '@angular/core';
import { observable, action, computed, reaction, toJS } from 'mobx';
import { UiStore } from './ui';
import { set, get, keyBy, merge, map, includes, isEmpty, omit, size, head } from 'lodash/fp';

@Injectable()
export class GistsStore {

  @observable gists = {};
  @observable staredGists = [];
  @observable current = <any>{};
  @observable localEdit = <any>{};
  @observable filter = '';

  constructor(private uiStore: UiStore) {
    this.setLocalDataReaction();
  }

  private processGist(gist) {
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

    gist.comments = gist.comments === 0 ? {} : size(gist.comments);
    return gist;
  }

  private setLocalDataReaction() {
    reaction(() => this.uiStore.editMode, (edit) => {
      (edit) ? this.setLocalData(this.currentGist.id) : this.clearLocalData();
    });
  }

  @computed get currentGist () {
    return this.current;
  }

  @computed get getGists () {
    return this.gists;
  }

  @computed get currentTimestamp () {
    return Math.floor(Date.now() / 1000);
  }

  @action setFilter(filter) {
    this.filter = filter;
  }

  @action changeLocalDataDescription(description) {
    this.localEdit.description = description;
  }

  @action changeLocalDataFile(filename, value) {
    this.localEdit.files[filename] = {
      filename: value,
      language: this.localEdit.files[filename].language,
      content: this.localEdit.files[filename].content,
      collapsed: false
    };
  }

  @action changeLocalDataContent(filename, value) {
    this.localEdit.files[filename] = {
      filename: this.localEdit.files[filename].filename,
      language: this.localEdit.files[filename].language,
      content: value,
      collapsed: false
    };
  }

  @action deleteLocalFile(filename) {
    this.localEdit.files[filename] = null;
  };

  @action setLocalData() {
    if (Object.keys(this.localEdit).length === 0) {
      this.localEdit = {
        description: this.currentGist.description,
        files: this.currentGist.files
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
    console.log('%c LOG ', 'background: #555; color: tomato', this.gists['5944686']);
  }

  @action setComments(id, comments) {
    this.gists[id].comments = keyBy('id', comments);
    this.setCurrentGist(this.gists[id], false);
  }
}
