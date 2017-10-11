import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Settings } from '../../../store/settings';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [Settings],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SettingsComponent {

  constructor(public settings: Settings) {}

  color = this.settings.color;

  themes = [
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

}
