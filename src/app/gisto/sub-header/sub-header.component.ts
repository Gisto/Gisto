import { Component } from '@angular/core';
import { GistsStore } from '../../store/gists';
import { size } from 'lodash/fp';

@Component({
  selector: 'sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent {

  size: any = size;

  private showMenu = false;

  constructor(private gistStore: GistsStore) { }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  updateFilter(value) {
    this.gistStore.setFilter(value);
  }
}