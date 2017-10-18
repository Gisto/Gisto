import { Component } from '@angular/core';
import { UiStore } from '../../store/ui';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private uiStore: UiStore) { }

  toggleSideBar() {
    this.uiStore.toggleSideBar();
  }

}
