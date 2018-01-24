import { Injectable } from '@angular/core';
import { observable, action, computed, reaction, toJS } from 'mobx';
import { UiStore } from './ui';
import { snippetStructure } from '../helpers/gist-structure';
import { set, get, keyBy, merge, map, includes, isEmpty, omit, size, head, assign } from 'lodash/fp';

@Injectable()
export class GistsStore {

  @observable gists = {};
  @observable staredGists = [];
  @observable current = <any>{};
  @observable localEdit = <any>{};
  @observable filter = '';
  @observable filterType = 'freeText';

  constructor(private uiStore: UiStore) {
    this.localDataReaction();
  }

  private processGist(gist) {
    gist.star = false;
    gist.star = this.staredGists.findIndex(id => gist.id === id) !== -1;

    return snippetStructure(gist);
  }

  private localDataReaction() {
    reaction(
      () => this.uiStore.editMode,
      (edit) => edit ? this.setLocalData() : this.clearLocalData(),
      { name: 'localDataReaction' }
    );
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

  @action setFilter(filter, type = 'freeText') {
    this.filter = filter;
    this.filterType = type;
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
  }

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
    const gistList = map(gist => this.processGist(gist), gists);
    this.gists = assign(keyBy('id', gistList), this.getGists);
  }

  @action setStarsOnGists(stared) {
    this.staredGists = stared.map(gist => gist.id);
  }

  @action setCurrentGist(result, proccess = false) {
    const newResult = proccess ? this.processGist(result) : result;
    const gist = this.gists[result.id];

    this.gists[result.id] = merge(this.gists[result.id], newResult);
    this.current = proccess ? this.processGist(gist) : gist;
  }

  @action clearCurrentGist() {
    return this.current = {};
  }

  @action expandCollapseFile(gistId, index) {
    this.gists[gistId].files[index].collapsed = !this.gists[gistId].files[index].collapsed;
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

  @action setComments(id, comments) {
    this.gists[id].comments = keyBy('id', comments);
    this.setCurrentGist(this.gists[id], false);
  }
}
