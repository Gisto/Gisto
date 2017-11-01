import { Component } from '@angular/core';
import { UiStore } from '../../store/ui';

@Component({
  selector: 'header',
  template: `
    <logo *ngIf="uiStore.sideBar"></logo>
    <header-main></header-main>
    <app-settings></app-settings>
    <user></user>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public uiStore: UiStore) { }

}
