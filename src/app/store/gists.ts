import { Injectable } from '@angular/core';
import { observable, action, computed, reaction, toJS } from 'mobx';
import { UiStore } from './ui';
import { snippetStructure } from '../helpers/gist-structure';
import {
  set, get, keyBy, merge, map, includes, isEmpty, omit, size, head, assign, find
} from 'lodash/fp';
import { v4 } from 'uuid';

@Injectable()
export class GistsStore {

  @observable gists = {};
  @observable staredGists = [];
  @observable current = <any>{};
  @observable localEdit = <any>{};
  @observable filter = '';
  @observable filterType = 'freeText';
  @observable filterCount = 0;

  constructor(private uiStore: UiStore) {
    this.currentGistReaction();
    this.localDataReaction();
    this.localChangeDataReaction();
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

  private localChangeDataReaction() {
    reaction(
      () => this.localEdit.files.map(file => file.filename),
      () => console.log('%c this.localEdit ', 'background: #555; color: tomato', toJS(this.localEdit)),
      { name: 'localDataReaction' }
    );
  }

  private currentGistReaction () {
    reaction(
      () => this.currentGist.id,
      () => console.log('%c this.currentGist ', 'background: #555; color: tomato', toJS(this.currentGist)),
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

  @computed get getFilterCount() {
    return this.filterCount;
  }

  @action setFilterCount(counts) {
    this.filterCount = counts;
  }

  @action changeLocalDataDescription(description) {
    this.localEdit.description = description;
  }

  @action changeLocalDataFile(file, value, index = 0) {
    let originalFileName;
    if (file.isNew) {
      originalFileName = file.originalFileName;
    } else {
      originalFileName = find({ uuid: file.uuid }, toJS(this.currentGist.files)).filename;
    }
    const localFile = find({ uuid: file.uuid }, toJS(this.localEdit.files));

    this.localEdit.files[index] = { ...localFile, filename: value, originalFileName };
  }

  @action changeLocalDataContent(file, value, index = 0) {
    let originalFileName;
    if (file.isNew) {
      originalFileName = file.originalFileName;
    } else {
      originalFileName = find({ uuid: file.uuid }, toJS(this.currentGist.files)).filename;
    }
    const localFile = find({ uuid: file.uuid }, toJS(this.localEdit.files));

    this.localEdit.files[index] = { ...localFile, content: value, originalFileName };
  }

  @action deleteLocalFile(uuid, index = 0) {
    this.localEdit.files[index] = null;
  }

  @action setLocalData() {
    if (Object.keys(this.localEdit).length === 0) {
      const files = this.currentGist.files.map((file) => ({ originalFileName: file.filename, ...file }));

      this.localEdit = {
        description: this.currentGist.description,
        files
      };
    }
  }

  @action clearLocalData() {
    this.localEdit = {};
  }

  @action addNewFileToLocalEdit() {
    this.localEdit.files.unshift({
      originalFileName: 'untitled.txt',
      isNew: true,
      filename: 'untitled.txt',
      content: '',
      language: null,
      uuid: v4(),
      collapsed: false
    });
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
    const star = this.gists[result.id] ? this.gists[result.id].star : false;
    this.gists[result.id] = newResult;
    this.gists[result.id].star = star;
    this.current = proccess ? this.processGist(newResult) : newResult;
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
    this.current = {};
  }

  @action setComments(id, comments) {
    this.gists[id].comments = keyBy('id', comments);
    this.setCurrentGist(this.gists[id], false);
  }
}
