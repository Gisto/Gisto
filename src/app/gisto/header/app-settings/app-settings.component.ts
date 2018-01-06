import { Component } from '@angular/core';
import { UiStore } from '../../../store/ui';

@Component({
  selector: 'app-settings',
  template: `
    <gist-utils icon="info"></gist-utils>
    <gist-utils icon="notification" (click)="showNotifications = !showNotifications">
      <ul *ngIf="showNotifications">
        <li>This is notification.</li>
        <li>sdfsdf</li>
        <li>sdfsdf</li>
        <li>sdfsdf</li>
      </ul>
    </gist-utils>
    <gist-utils icon="globe"></gist-utils>
    <gist-utils routerLink="/settings" icon="cog"></gist-utils>
  `,
  styleUrls: ['./app-settings.component.scss']
})

export class AppSettingsComponent {

  public showNotifications;

  constructor(public uiStore: UiStore) {}

}
