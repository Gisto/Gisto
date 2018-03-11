import { Component, OnInit, OnChanges, NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SettingsStore } from '../store/settings';
import { GithubAuthorizationService } from '../github-authorization.service';
import { GithubApiService } from '../github-api.service';
import { version } from '../helpers/version';
import { ElectronService } from 'ngx-electron';
import { NotificationsStore } from '../store/notifications';

@Component({
  selector: 'login',
  template: `
    <div>
      <logo></logo>
      <small>v.{{ version }} {{ updateMessage ? ' | ' + updateMessage : '' }}</small>
      <button *ngIf="!isLoggingdIn" invert (click)="login()">Log-in with Github account</button>
      <p *ngIf="isLoggingdIn"><icon icon="loading" color="#555"></icon> Loading...</p>
    </div>

  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnChanges {

  version: string = version;
  updateMessage = 'Up to date';
  isLoggingdIn = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authorization: GithubAuthorizationService,
              private githubApiService: GithubApiService,
              private settingsStore: SettingsStore,
              private electronService: ElectronService,
              private notification: NotificationsStore,
              private zone: NgZone) {}

  ngOnInit() {
    if (this.settingsStore.isLoggedIn) {
      this.isLoggingdIn = true;
      this.navigateToMainScreen();
    }

    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.on('message', (event, text, info) => {
        this.zone.run(() => {
          this.setMessage(text);
        });
      });
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

  setMessage(text) {
    console.log('%c setMessage ', 'background: #555; color: tomato', text);
    this.updateMessage = text;
    this.notification.addNotification('error', 'Updater', text);
  }

  ngOnChanges() {
    this.setMessage('lalala');
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
