import { Component } from '@angular/core';
import { NotificationsStore } from '../../../store/notifications';

@Component({
  selector: 'notifications',
  template: `
    <div *ngFor="let notification of notifications.getNotifications; index as notificationIndex"
         class="notification {{ notification.type }} {{ notification.id }}"
         (mouseenter)="toggleClose(notificationIndex)"
         (mouseleave)="toggleClose(notificationIndex)">
      <div class="notification-icon">

        <i *ngIf="showClose !== notificationIndex" class="fa {{ mapIconsByType(notification.type) }}"></i>
        <a *ngIf="showClose === notificationIndex" class="close" (click)="removeNotification(notification.id)">
          <i class="fa fa-times"></i>
        </a>

      </div>
      <div class="notification-content">
        <h3 class="notification-title" [innerHTML]="notification.title"></h3>
        <div class="notification-body" [innerHTML]="notification.body"></div>
      </div>
    </div>
  `,
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  public showClose: number;

  constructor(public notifications: NotificationsStore) { }

  toggleClose = (index: number) => {
    this.showClose = this.showClose !== index ? this.showClose = index : this.showClose = null;
  }

  mapIconsByType(type) {
    switch (type) {
      case 'success':
        return 'fa-check';
      case 'error':
        return 'fa-exclamation-triangle';
      case 'info':
      case 'warn':
        return 'fa-exclamation-circle';
      default: return 'fa-info';
    }
  }

  removeNotification(id: any) {
    this.notifications.removeNotification(id);
    this.showClose = null;
  }

}
