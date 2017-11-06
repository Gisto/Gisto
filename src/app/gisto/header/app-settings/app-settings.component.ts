import { Component } from '@angular/core';
import { UiStore } from '../../../store/ui';

@Component({
  selector: 'app-settings',
  template: `
    <gist-utils icon="fa-info-circle"></gist-utils>
    <gist-utils icon="fa-bell-o" (click)="showNotifications = !showNotifications">
      <ul *ngIf="showNotifications">
        <li>This is notification.</li>
        <li>sdfsdf</li>
        <li>sdfsdf</li>
        <li>sdfsdf</li>
      </ul>
    </gist-utils>
    <gist-utils routerLink="/settings" icon="fa-cog" cssClass="{{ uiStore.loading && 'fa-spin' }}"></gist-utils>
  `,
  styleUrls: ['./app-settings.component.scss']
})

export class AppSettingsComponent {

  public showNotifications;

  constructor(public uiStore: UiStore) {}

}
