import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx';

@Injectable()
export class SettingsStore {
  @observable auth_token = localStorage.getItem('api-token') || '';
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
    return Boolean(this.auth_token);
  }

  @action setAnimation(value) {
    this.animations = value;
  }

  @action setToken(token) {
    localStorage.setItem('api-token', token);
  }

  @action logOut() {
    localStorage.setItem('api-token', '');
    this.auth_token = '';
  }
}
