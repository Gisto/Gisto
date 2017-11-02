import { Component } from '@angular/core';
import { UiStore } from '../../store/ui';
import { UserStore } from '../../store/user';

@Component({
  selector: 'header',
  template: `
    <logo *ngIf="uiStore.sideBar"></logo>
    <header-main></header-main>
    <app-settings></app-settings>
    <user [avatar]="userStore.user.avatar_url"
          name="{{ userStore.user.name || userStore.user.login }}"
          [manage]="true"></user>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public uiStore: UiStore, public userStore: UserStore) {
  }

}
