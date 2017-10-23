import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {SettingsStore} from "./store/settings";

@Injectable()
export class GithubAuthorizationService {

  private fetchTokenUrl = 'https://gisto-gatekeeper.herokuapp.com/authenticate';
  private clientId = '193ae0478f15bfda404e';
  private scope = ['gist'];

  constructor(private http: Http, private settingsStore: SettingsStore) { }

  login() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&scope=${this.scope.join(' ')}`;
  }

  fetchAuthToken(code: string) {
    return this.http.get(`${this.fetchTokenUrl}/${code}`)
      .toPromise()
      .then((response) => response.json())
      .then((response) => this.settingsStore.setToken(response.token));
  }
}
