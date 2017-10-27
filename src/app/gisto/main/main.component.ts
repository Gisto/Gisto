import { Component } from '@angular/core';
import { GithubApiService } from "../../github-api.service";
import { UiStore } from "../../store/ui";
import { SettingsStore } from "../../store/settings";
import { GistsStore } from "../../store/gists";

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {

  constructor(
    public uiStore: UiStore,
    private githubApiService: GithubApiService,
    private settingsStore: SettingsStore,
    private gistsStore: GistsStore
  ) { }

  ngOnInit() {
    if (this.settingsStore.isLoggedIn) {
      this.githubApiService.getUser();
      this.githubApiService.getGists();
      this.githubApiService.getStaredGists();
    }
  }
}
