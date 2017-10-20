import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx-angular';

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

  @action setAnimation(value) {
    this.animations = value;
  }
}
