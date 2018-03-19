import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx';
import { gitHubTokenKeyInStorage } from '../constants/config';

@Injectable()
export class SettingsStore {
  @observable color = '#ff0000';
  @observable theme = 'vs';
  @observable animations = 'enabled';

  @action setColor(value) {
    this.color = value;
  }

  @action setTheme(value) {
    this.theme = value;
  }

  @computed get getTheme() {
    return this.theme;
  }

  @computed get isLoggedIn() {
    return Boolean(localStorage.getItem(gitHubTokenKeyInStorage));
  }

  @action setAnimation(value) {
    this.animations = value;
  }

  @action setToken(token) {
    localStorage.setItem(gitHubTokenKeyInStorage, token);
  }

  @action logOut() {
    localStorage.setItem(gitHubTokenKeyInStorage, '');
  }
}
