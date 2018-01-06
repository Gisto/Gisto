import { Component } from '@angular/core';
import { UiStore } from '../../../store/ui';

@Component({
  selector: 'header-main',
  template: `
    <a (click)="toggleSideBar()" class="toggle-side-pannels">
      <icon icon="menu"></icon>
    </a>
  `,
  styleUrls: ['./header-main.component.scss']
})
export class HeaderMainComponent {

  constructor(private uiStore: UiStore) { }

  toggleSideBar() {
    this.uiStore.toggleSideBar();
  }

}
