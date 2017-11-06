import { Injectable } from '@angular/core';
import { observable, action, computed, toJS } from 'mobx';
import { remove } from 'lodash/fp';

@Injectable()
export class NotificationsStore {
  _timers = null;
  @observable notifications = [];

  @computed get getNotifications() {
    return this.notifications;
  }

  @action addNotification = (type = 'info', title, body = '', timeout = 5000) => {
    const id = `notification-${Math.floor((+new Date() / 10))}`;

    if (timeout !== null) {
      this.notifications.push({ id, type, title, body, timeout});
      this._timers = setTimeout(() => this.removeNotification(id, true), timeout);

      return true;
    }
    return this.notifications.push({ id, type, title, body, timeout });
  }

  @action removeNotification = (id, clearTimers = false) => {
    if (clearTimers) {
      clearTimeout(this._timers);
      this._timers = null;
    }
    this.notifications = remove({ id }, toJS(this.notifications));

    return true;
  }
}
