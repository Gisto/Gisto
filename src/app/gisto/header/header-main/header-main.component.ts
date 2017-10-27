import { Component } from '@angular/core';
import { UiStore } from '../../../store/ui';

@Component({
  selector: 'header-main',
  templateUrl: './header-main.component.html',
  styleUrls: ['./header-main.component.scss']
})
export class HeaderMainComponent {

  constructor(private uiStore: UiStore) { }

  toggleSideBar() {
    this.uiStore.toggleSideBar();
  }

}
