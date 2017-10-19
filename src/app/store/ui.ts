import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx-angular';

@Injectable()
export class UiStore {
  @observable loading = false;
  @observable editMode = false;
  @observable sideBar = true;

  @computed get isEdit() {
    return this.editMode;
  }

  @action toggleSideBar = () => this.sideBar = !this.sideBar;

  @action setModeToEdit() {
    this.editMode = true;
  }

  @action unsetModeToEdit() {
    this.editMode = false;
  }

}
