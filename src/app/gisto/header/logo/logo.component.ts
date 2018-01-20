import { Component } from '@angular/core';
import { logoText } from '../../../constants/config';
import { GistsStore } from '../../../store/gists';

@Component({
  selector: 'logo',
  template: `
    <a routerLink="/main" routerLinkActive="active" (click)="gistsStore.clearCurrentGist()">{{ logo }}</a>
  `,
  styleUrls: ['./logo.component.scss']
})

export class LogoComponent {
  public logo: string = logoText;

  constructor(public gistsStore: GistsStore) {}
}
