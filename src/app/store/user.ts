import { Injectable } from '@angular/core';
import { observable, action } from 'mobx-angular';


@Injectable()
export class UserStore {

  @observable user = {};

  @action setUser(data) {
    this.user = data;
  }
}
