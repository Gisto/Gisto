import { Component } from '@angular/core';
import { UiStore } from '../../store/ui';
import { UserStore } from '../../store/user';
import {GistsStore} from '../../store/gists';

@Component({
  selector: 'header',
  template: `
    <logo *ngIf="uiStore.sideBar"></logo>
    <header-main></header-main>
    <app-settings></app-settings>
    <user [user]="userStore.user" [manage]="true"></user>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public uiStore: UiStore, public userStore: UserStore) {
  }

}
