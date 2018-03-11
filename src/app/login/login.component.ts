import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SettingsStore } from '../store/settings';
import { GithubAuthorizationService } from '../github-authorization.service';
import { GithubApiService } from '../github-api.service';
import { version } from '../helpers/version';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'login',
  template: `
    <div>
      <update-notifier></update-notifier>
      <logo></logo>
      <small>v.{{ version }}</small>
      <button *ngIf="!isLoggingdIn" invert (click)="login()">Log-in with Github account</button>
      <p *ngIf="isLoggingdIn"><icon icon="loading" color="#555"></icon> Loading...</p>
    </div>

  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  version: string = version;
  isLoggingdIn = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authorization: GithubAuthorizationService,
              private githubApiService: GithubApiService,
              private settingsStore: SettingsStore,
              private electronService: ElectronService) {}

  ngOnInit() {
    if (this.settingsStore.isLoggedIn) {
      this.isLoggingdIn = true;
      this.navigateToMainScreen();
    }

    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.on('token', (event, token) => {
        localStorage.setItem('api-token', token);
        this.navigateToMainScreen();
      });
    } else {
      this.route
        .queryParams
        .subscribe((params: Params) => {
          const code = params['code'];

          if (code) {
            this.authorization.fetchAuthToken(code)
              .then(() => this.navigateToMainScreen());
          } else {
            this.isLoggingdIn = false;
          }
        });
    }
  }

  navigateToMainScreen() {
    this.isLoggingdIn = true;
    this.githubApiService.getUser();
    this.githubApiService.getGists();
    this.githubApiService.getStaredGists();
    this.router.navigate(['/main']);
  }

  login() {
    this.isLoggingdIn = true;
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.send('oauth2-login');
    } else {
      this.authorization.login();
    }
  }
}
