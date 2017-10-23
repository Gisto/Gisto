import { Component } from '@angular/core';
import {UiStore} from "../../store/ui";
import {GithubApiService} from "../../github-api.service";
import {SettingsStore} from "../../store/settings";

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {

  constructor(
    public uiStore: UiStore,
    private githubApiService: GithubApiService,
    private settings: SettingsStore,
  ) {}

  ngOnInit () {
    if(this.settings.isLoggedIn) {
      this.githubApiService.getGists();
      this.githubApiService.getStaredGists();
    }
  }
}
