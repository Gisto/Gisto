import {Component} from '@angular/core';
import {SettingsStore} from '../../../store/settings';

@Component({
  selector: 'settings',
  template: `
    <header></header>
    <div class="content-wrapper" *mobxAutorun>
      <h2>Gisto settings</h2>
      <details open>

        <summary>Look & feel</summary>

        <p>Color
          <input type="color" (change)="changeColor($event)" value="{{ settings.color }}"/>
          <br> Current color: {{ settings.color }}
        </p>

        <p>Animations
          <select>
            <option *ngFor="let animation of animations" value="{{ animation.value }}">{{ animation.displayName }}
            </option>
          </select>
        </p>
      </details>
      <details>
        <summary>Editor</summary>

        <p>Theme
          <select (change)="changeTheme($event)">
            <option *ngFor="let theme of themes" value="{{ theme.value }}" [attr.selected]="settings.getTheme==theme.value">
              {{ theme.displayName }}
            </option>
          </select>
        </p>

      </details>
      <details>
        <summary>Defaults</summary>

      </details>
    </div>
  `,
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent {

  constructor(private settings: SettingsStore) {}

  color = this.settings.color;

  themes = [
    { value: 'vs', displayName: 'Light' },
    { value: 'vs-dark', displayName: 'Dark' }
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
