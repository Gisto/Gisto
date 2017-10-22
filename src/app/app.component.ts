import { Component, OnInit } from '@angular/core';
import { SettingsStore } from './store/settings';
import { GistsStore } from './store/gists';
import { UserStore } from './store/user';
import { UiStore } from './store/ui';
import { GithubApiService } from './github-api.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(
    private githubApiService: GithubApiService,
    private router: Router,
    private settings: SettingsStore,
    private route: ActivatedRoute) {}

  login() {
    if(!this.settings.isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/main']);
      this.githubApiService.getGists();
      this.githubApiService.getStaredGists();
    }
  }

  ngOnInit () {
    this.login();
  }
}
