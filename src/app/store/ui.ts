import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx';

@Injectable()
export class UiStore {
  @observable loading = false;
  @observable editMode = false;
  @observable sideBar = true;
  @observable comments = false;

  @computed get isEdit() {
    return this.editMode;
  }

  @action toggleSideBar = () => this.sideBar = !this.sideBar;

  @action toggleCommentsBar = () => this.comments = !this.comments;

  @action setModeToEdit() {
    this.editMode = true;
    this.toggleSideBar();
    if (this.comments) {
      this.toggleCommentsBar();
    }
  }

  @action unsetModeToEdit() {
    this.editMode = false;
    this.toggleSideBar();
  }

}
