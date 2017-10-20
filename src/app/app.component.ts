import { Component, OnInit } from '@angular/core';
import { SettingsStore } from './store/settings';
import { GistsStore } from './store/gists';
import { UserStore } from './store/user';
import { UiStore } from './store/ui';
import { GithubApiService } from './github-api.service';
import { Router } from '@angular/router';

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

  constructor(private githubApiService: GithubApiService, private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['/main']);
    this.githubApiService.getGists();
    this.githubApiService.getStaredGists();
  }
}
