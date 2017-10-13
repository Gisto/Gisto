import { Component } from '@angular/core';
import { GistsStore } from '../../store/gists';

@Component({
  selector: 'sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent {

  private showMenu = false;

  constructor(private gistStore: GistsStore) { }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
