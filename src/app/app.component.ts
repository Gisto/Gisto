import { Component, OnInit } from '@angular/core';
import { SettingsStore } from './store/settings';
import { GistsStore } from './store/gists';
import { UserStore } from './store/user';
import { UiStore } from './store/ui';
import { GithubApiService } from './github-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    SettingsStore,
    GistsStore,
    UserStore,
    UiStore,
    GithubApiService
  ]
})
export class AppComponent implements OnInit {

  constructor(private githubApiService: GithubApiService) {}

  ngOnInit(): void {
    this.githubApiService.getGists();
    this.githubApiService.getStaredGists();
  }
}
