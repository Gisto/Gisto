import { Component } from '@angular/core';
import { SettingsStore } from './store/settings';
import { GistsStore } from './store/gists';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    SettingsStore,
    GistsStore
  ]
})
export class AppComponent {
  title = 'app';
}
