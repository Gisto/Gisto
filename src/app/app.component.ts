import { Component, OnDestroy } from '@angular/core';
import { SettingsStore } from './store/settings';
import { GistsStore } from './store/gists';
import { UserStore } from './store/user';
import { UiStore } from './store/ui';
import { GithubApiService } from './github-api.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <notifications></notifications>
    <super-search *ngIf="uiStore.superSearch"></super-search>
    <hotkeys-cheatsheet></hotkeys-cheatsheet>
  `,
  styleUrls: ['./app.component.scss'],
  providers: [
    SettingsStore,
    GistsStore,
    UserStore,
    UiStore,
    GithubApiService
  ]
})
export class AppComponent implements OnDestroy {

  hotkeyShiftSpace: Hotkey | Hotkey[];

  constructor(private hotkeysService: HotkeysService, public uiStore: UiStore) {
    this.hotkeyShiftSpace = hotkeysService.add(
      new Hotkey('shift+space', this.hotkeyShiftSpacePressed, ['INPUT', 'TEXTAREA'], 'Super search')
    );
  }

  hotkeyShiftSpacePressed = (event: KeyboardEvent, combo: string): boolean => {
    this.uiStore.superSearch = !this.uiStore.superSearch;
    return true;
  }

  ngOnDestroy() {
    this.hotkeysService.remove(this.hotkeyShiftSpace);
  }

}
