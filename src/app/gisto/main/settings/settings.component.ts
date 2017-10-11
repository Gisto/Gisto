import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  
})
export class SettingsComponent {

  themes = [
    { value: 'lite', displayName: 'Light' },
    { value: 'dark', displayName: 'Dark' }
  ];

  animations = [
    { value: 'enabled', displayName: 'Enabled' },
    { value: 'disabled', displayName: 'Disabled' }
  ];

}
