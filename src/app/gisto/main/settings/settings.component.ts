import { Component } from '@angular/core';
import { SettingsStore } from '../../../store/settings';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent {

  constructor(private settings: SettingsStore) {}

  color = this.settings.color;

  themes = [
    { value: 'default', displayName: 'Default' },
    { value: 'lite', displayName: 'Light' },
    { value: 'dark', displayName: 'Dark' }
  ];

  animations = [
    { value: 'enabled', displayName: 'Enabled' },
    { value: 'disabled', displayName: 'Disabled' }
  ];

  changeColor(color) {
    this.settings.setColor(color.target.value);
  }

  changeTheme(theme) {
    this.settings.setTheme(theme.target.value);
  }

}
