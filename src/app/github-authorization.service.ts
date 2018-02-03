import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { SettingsStore } from './store/settings';
import * as request from 'superagent';

@Injectable()
export class GithubAuthorizationService {

  private fetchTokenUrl = 'https://gisto-gatekeeper.herokuapp.com/authenticate';
  private clientId = '193ae0478f15bfda404e';
  private scope = ['gist'];

  constructor(private settingsStore: SettingsStore) {
  }

  login() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&scope=${this.scope.join(' ')}`;
  }

  fetchAuthToken(code: string) {
    return request.get(`${this.fetchTokenUrl}/${code}`)
      .then((response) => this.settingsStore.setToken(response.body.token));
  }
}
