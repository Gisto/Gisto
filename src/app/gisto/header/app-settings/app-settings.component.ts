import { Component } from '@angular/core';
import { UiStore } from '../../../store/ui';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent {

  constructor(private uiStore: UiStore) {}

}
