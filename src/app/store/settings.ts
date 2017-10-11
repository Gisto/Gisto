import {Injectable} from '@angular/core';
import {observable, action} from 'mobx-angular';

@Injectable()
export class Settings {
  @observable color = '#ff0000';
  @observable theme = 'default';
  @observable animations = true;

  @action setColor(value) {
    this.color = value;
  }
}
