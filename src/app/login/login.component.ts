import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { SettingsStore } from '../store/settings';
import {GithubAuthorizationService} from "../github-authorization.service";
import {GithubApiService} from "../github-api.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authorization: GithubAuthorizationService,
    private githubApiService: GithubApiService,
    private settingsStore: SettingsStore
  ) { }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe((params: Params) => {
        const code  = params['code'];

        if (code) {
          this.authorization.fetchAuthToken(code)
            .then(() => this.navigateToMainScreen());
        }
      });

    if (this.settingsStore.isLoggedIn) {
      this.navigateToMainScreen();
    }
  }

  navigateToMainScreen() {
    this.githubApiService.getUser();
    this.githubApiService.getGists();
    this.githubApiService.getStaredGists();
    this.router.navigate(['/main']);
  }

  login() {
    this.authorization.login();
  }
}
