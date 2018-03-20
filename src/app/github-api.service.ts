import { Injectable } from '@angular/core';
import { keyBy, map, omit, set } from 'lodash/fp';
import { GistsStore } from './store/gists';
import { UiStore } from './store/ui';
import { UserStore } from './store/user';
import { SettingsStore } from './store/settings';
import { NotificationsStore } from './store/notifications';
import * as API from 'superagent';
import { Router} from '@angular/router';
import { normalizeFiles } from './helpers/files';
import { gitHubTokenKeyInStorage } from './constants/config';

require('dotenv').config({ path: '../../.env'});

@Injectable()
export class GithubApiService {

  private token: string;

  constructor(
    private gistsStore: GistsStore,
    private uiStore: UiStore,
    private userStore: UserStore,
    private settingsStore: SettingsStore,
    private notificationsStore: NotificationsStore,
    private router: Router
    ) { }

  baseUrl = (path = 'gists') => `https://api.github.com/${path}`;

  _headers() {
    this.token = localStorage.getItem(gitHubTokenKeyInStorage);

    return { 'Content-Type': 'application/json', 'Authorization': `token ${this.token}` };
  }

  errorHandler(error, result) {
    this.uiStore.loading = false;

    if (error) {
      this.notificationsStore.addNotification('error', `Error code: ${error.status}`, error.response.body.message);
      return this.router.navigate(['/login']);
    } else if (result.statusCode > 204) {
      this.notificationsStore.addNotification('info', result.statusText, result.body.description);
      return this.router.navigate(['/login']);
    }
  }

  login(user, pass, twoFactorAuth = null) {
    let basicAuthHeader = {
      Authorization: `basic ${btoa(user + ':' + pass)}`
    };

    if (twoFactorAuth) {
      basicAuthHeader = set('X-GitHub-OTP', twoFactorAuth, basicAuthHeader);
    }

    API.post(this.baseUrl('authorizations'))
      .set(basicAuthHeader)
      .send(JSON.stringify({
        scopes: ['gist'],
        note: 'Gisto - Snippets made simple',
        note_url: 'http://www.gistoapp.com',
        fingerprint: new Date().getTime()
      }))
      .end((error, result) => {
        this.errorHandler(error, result);
        if (result.header['x-github-otp']) {
          this.settingsStore.auth2fa = true;
        }
        if (result.statusCode === 201) {
          this.settingsStore.setToken(result.body.token);
          this.settingsStore.auth2fa = false;
          return this.router.navigate(['/main']);
        }
      });
  }

  validateTokenAndLogIn(token) {
    API.get(this.baseUrl('user'))
      .set({ Authorization: `token ${token}` })
      .end((error, result) => {
        this.errorHandler(error, result);
        if (result.statusCode === 200) {
          this.settingsStore.setToken(token);
          return this.router.navigate(['/main']);
        }
      });
  }

  getGists(page: number = 1) {
    this.uiStore.loading = true;
    API.get(`${this.baseUrl()}?page=${page}&per_page=100`)
      .set(this._headers())
      .end((error, result) => {
        this.errorHandler(error, result);
        if (result.headers.link.match(/next/ig)) {
          this.getGists(page + 1);
        }
        this.gistsStore.setGists(result.body);
      });
  }

  getStaredGists() {
    API.get(`${this.baseUrl()}/starred`)
      .set(this._headers())
      .end((error, result) => this.gistsStore.setStarsOnGists(result.body));
  }

  getGist(id: string) {
    this.uiStore.loading = true;
    API.get(`${this.baseUrl()}/${id}`)
      .set(this._headers())
      .end((error, result) => {
        this.errorHandler(error, result);
        this.uiStore.loading = false;
        this.getComments(id);
        this.gistsStore.setCurrentGist(result.body, true);
      });
  }

  createGist(data: object) {
    this.uiStore.loading = true;
    API.post(this.baseUrl())
      .set(this._headers())
      .send(JSON.stringify(data))
      .end((error, result) => {
        this.errorHandler(error, result);
        if (result.statusCode === 201) {
          this.router.navigate([`/gist/${result.body.id}`]);
          this.gistsStore.setCurrentGist(result.body, true);
          this.notificationsStore.addNotification('success', result.statusText, result.body.description);
        }
      });
  }

  starGist(id: string) {
    this.uiStore.loading = true;
    API.put(`${this.baseUrl()}/${id}/star`)
      .set(this._headers())
      .end((error, result) => {
        this.errorHandler(error, result);
        this.gistsStore.star(id);
        this.notificationsStore.addNotification('success', 'Star', this.gistsStore.current.description + ' starred');
      });
  }

  unStarGist(id: string) {
    this.uiStore.loading = true;
    API.del(`${this.baseUrl()}/${id}/star`)
      .set(this._headers())
      .end((error, result) => {
        this.errorHandler(error, result);
        this.gistsStore.unStar(id);
        this.notificationsStore.addNotification('success', 'Star removed', 'From: ' + this.gistsStore.current.description);
      });
  }

  deleteGist(id: string) {
    this.uiStore.loading = true;
    API.del(`${this.baseUrl()}/${id}`)
      .set(this._headers())
      .end((error, result) => {
        this.errorHandler(error, result);
        this.gistsStore.deleteGist(id);
      });
  }

  updateGist(id: string) {
    const { description, files } = this.gistsStore.localEdit;
    const gistNewData = {
      description,
      files: normalizeFiles(files)
    };

    this.uiStore.loading = true;
    API.patch(`${this.baseUrl()}/${id}`)
      .set(this._headers())
      .send(gistNewData)
      .end((error, result) => {
        this.errorHandler(error, result);
        this.gistsStore.setCurrentGist(result.body, true);
      });
  }

  getUser() {
    this.uiStore.loading = true;
    API.get(this.baseUrl('user'))
      .set(this._headers())
      .end((error, result) => {
        this.errorHandler(error, result);
        this.userStore.setUser(result.body);
      });
  }

  getComments(id: string) {
    this.uiStore.loading = true;
    API.get(`${this.baseUrl()}/${id}/comments`)
      .set(this._headers())
      .end((error, result) => {
        this.errorHandler(error, result);
        this.gistsStore.setComments(id, result.body);
      });
  }

  addComment(id: string, body: string) {
    this.uiStore.loading = true;
    API.post(`${this.baseUrl()}/${id}/comments`)
      .set(this._headers())
      .send({ body })
      .end((error, result) => {
        this.errorHandler(error, result);
        this.getComments(id);
      });
  }

}
