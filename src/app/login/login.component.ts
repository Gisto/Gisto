import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SettingsStore } from '../store/settings';
import { NotificationsStore } from '../store/notifications';
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
      
      <button *ngIf="!isLoggingdIn && !tokenFormShown" invert (click)="login()">Log-in with GitHub</button>
      
      <div *ngIf="!isLoggingdIn && tokenFormShown">
        <h4>GitHub sign - in using token</h4>
          <input type="text" #token placeholder="GitHub token"/>
          <br/>
          <button invert (click)="loginWithToken(token.value)">Log-in</button>
          <br/>
          <a (click)="resetLogin()">Back to log-in options</a>  
      </div>
      
      <br/>
      <br/>
      <a *ngIf="!isLoggingdIn && !tokenFormShown" (click)="showTokenForm()">Log-in using token</a>
      
      <p *ngIf="isLoggingdIn"><icon icon="loading" color="#555"></icon> Loading...</p>
    </div>

  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  version: string = version;
  isLoggingdIn = false;
  tokenFormShown = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authorization: GithubAuthorizationService,
              private githubApiService: GithubApiService,
              private settingsStore: SettingsStore,
              private notifications: NotificationsStore,
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

  resetLogin() {
    this.router.navigate(['/login']);
    this.isLoggingdIn = false;
    this.tokenFormShown = false;
  }

  showTokenForm() {
    this.tokenFormShown = true;
  }

  loginWithToken(token) {
    if (!token) {
      return this.notifications.addNotification('error', 'Token must be set', 'Token is a required field', null);
    }
    this.settingsStore.setToken(token);
    this.navigateToMainScreen();
  }
}
