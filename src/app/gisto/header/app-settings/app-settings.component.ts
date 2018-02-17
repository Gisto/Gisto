import { Component } from '@angular/core';
import { UiStore } from '../../../store/ui';
import { GistsStore } from '../../../store/gists';

@Component({
  selector: 'app-settings',
  template: `
    <gist-utils icon="dashboard" routerLink="/main" (click)="gistsStore.clearCurrentGist()" color="#fff"></gist-utils>
    <gist-utils icon="info" color="#fff"></gist-utils>
    <gist-utils icon="notification" color="#fff" (click)="showNotifications = !showNotifications">
      <ul *ngIf="showNotifications">
        <li>This is notification.</li>
        <li>sdfsdf</li>
        <li>sdfsdf</li>
        <li>sdfsdf</li>
      </ul>
    </gist-utils>
    <gist-utils icon="globe" [color]="online()"></gist-utils>
    <gist-utils routerLink="/settings" icon="cog" color="#fff"></gist-utils>
  `,
  styleUrls: ['./app-settings.component.scss']
})

export class AppSettingsComponent {

  public showNotifications;

  constructor(public uiStore: UiStore, public gistsStore: GistsStore) {}

  online = () => navigator.onLine ? '#fff' : 'tomato';
}
