import { Injectable } from '@angular/core';
import { observable, action } from 'mobx';


@Injectable()
export class UserStore {

  @observable user: object = {};

  @action setUser(data: object) {
    this.user = data;
  }
}
