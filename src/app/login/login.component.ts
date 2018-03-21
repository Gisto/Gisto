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
    <div *mobxAutorun>
      <update-notifier></update-notifier>
      <logo></logo>
      <small>v.{{ version }}</small>
      
      <button *ngIf="!isLoggingdIn && !tokenFormShown && !basicFormShown" invert (click)="loginwithOauth2()">Log-in with GitHub</button>
      
      <div *ngIf="!isLoggingdIn && !basicFormShown && tokenFormShown">
        <h4>Sign-in using GitHub token</h4>
          <input type="text" #token placeholder="GitHub token"/>
          <a target="_new" href="https://github.com/settings/tokens">
            <icon icon="info" size="16" color="#3f83a8"></icon>
          </a>
          <br/>
          <button (click)="loginWithToken(token.value)">Log-in</button>
          <br/>
          <a (click)="resetLogin()">Cancel</a>  
      </div>

      <div *ngIf="!isLoggingdIn && basicFormShown && !tokenFormShown">
        <h4 *ngIf="!enterprise">Sign-in using GitHub username and password</h4>
        <h4 *ngIf="enterprise">Setup enterprise endpoints and log-in</h4>
        
        <user [user]="{avatar_url: settingsStore.getDefaultUrl + '/' + (user.value || 'gisto') + '.png', login: (user.value || 'gisto')}">
        </user>
        
        <br />
        <br />
        
        <a (click)="enterprise=!enterprise" *ngIf="!enterprise">
          Use enterprise
        </a>
        
        <br/>
        
        <div *ngIf="enterprise">

          <input type="text"
                 #EnterpriseDomain
                 (keyup)="setEnterpriseDomain(EnterpriseDomain.value)"
                 placeholder="Enterprise domain"/>
          <br/>
          <br/>
        </div>
        
        <br/>
        
        <input type="text" 
               #user 
               placeholder="GitHub email or username"/>
        <br/>
        <br/>
        
        <input type="password" 
               #pass 
               placeholder="GitHub password"/>
        <br/>
        <br/>
        
        <input [ngStyle]="{'visibility': settingsStore.auth2faNeeded ? 'visible' : 'hidden'}" 
               type="text" 
               #twoFactorAuth 
               placeholder="Two factor token (2fa)"/>
        
        <br/>
        <button (click)="loginWithBasic(user.value, pass.value, twoFactorAuth.value)">Log-in</button>
        <br/>


        <a (click)="enterprise=!enterprise" *ngIf="enterprise">
          <ng-container>Use Regular GitHub</ng-container> | 
        </a>
        <a (click)="resetLogin()">Cancel</a>
      </div>
      
      <p *ngIf="!isLoggingdIn && !basicFormShown && !tokenFormShown" class="options">
        or sign-in using GitHub 
        <a (click)="showTokenForm()">
          token
        </a> 
        or 
        <a (click)="showBasicForm()">
          username and password
        </a>
      </p>
      
      <p *ngIf="isLoggingdIn"><icon icon="loading" color="#555"></icon> Loading...</p>
    </div>

  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  version: string = version;
  isLoggingdIn = false;
  tokenFormShown = false;
  basicFormShown = false;
  enterprise = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authorization: GithubAuthorizationService,
              private githubApiService: GithubApiService,
              public settingsStore: SettingsStore,
              private notifications: NotificationsStore,
              private electronService: ElectronService) {}

  ngOnInit() {
    if (!this.settingsStore.getDefaultUrl) {
      this.settingsStore.setDefaultUrl();
      this.settingsStore.setApiUrl();
      this.settingsStore.setGistUrl();
    }

    if (this.settingsStore.isLoggedIn) {
      this.isLoggingdIn = true;
      this.navigateToMainScreen();
    }

    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.on('token', (event, token) => {
        this.settingsStore.setToken(token);
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

  loginwithOauth2() {
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
    this.basicFormShown = false;
  }

  showTokenForm() {
    this.tokenFormShown = true;
  }

  showBasicForm() {
    this.basicFormShown = true;
  }

  loginWithToken(token) {
    if (!token) {
      return this.notifications.addNotification('error', 'Token must be set', 'Token is a required field');
    }

    this.githubApiService.validateTokenAndLogIn(token);
  }

  loginWithBasic(user, pass, twoFactorAuth = null) {
    if (!user || !pass) {
      return this.notifications.addNotification(
        'error',
        'Username and password must be set',
        'Both Username and password are a required fields'
      );
    }

    this.githubApiService.login(user, pass, twoFactorAuth);
  }

  setEnterpriseDomain(value) {
    this.settingsStore.setDefaultUrl(value);
    this.settingsStore.setGistUrl(value + '/gist');
    this.settingsStore.setApiUrl(value + '/api/v3');
  }
}
