import { Injectable } from '@angular/core';
import { observable, action } from 'mobx-angular';

@Injectable()
export class SettingsStore {
  @observable color = '#ff0000';
  @observable theme = 'lite';
  @observable animations = 'enabled';

  @action setColor(value) {
    this.color = value;
  }

  @action setTheme(value) {
    this.theme = value;
  }

  @action setAnimation(value) {
    this.animations = value;
  }
}
