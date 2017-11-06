import { Injectable } from '@angular/core';
import { GistsStore } from './store/gists';
import { UiStore } from './store/ui';
import { UserStore } from './store/user';
import { NotificationsStore } from './store/notifications';
import * as API from 'superagent';

@Injectable()
export class GithubApiService {

  private token: string = localStorage.getItem('api-token');
  private _headers: object = { 'Content-Type': 'application/json', 'Authorization': `token ${this.token}` };

  constructor(
    private gistsStore: GistsStore,
    private uiStore: UiStore,
    private userStore: UserStore,
    private notificationsStore: NotificationsStore
    ) { }

  baseUrl = (path = 'gists') => `https://api.github.com/${path}`;

  getGists(page: number = 1) {
    this.uiStore.loading = true;
    API.get(`${this.baseUrl()}?page=${page}`)
      .set(this._headers)
      .end((error, result) => {
        if (result.headers.link.match(/next/ig)) {
          this.getGists(page + 1);
        }
        this.uiStore.loading = false;
        this.gistsStore.setGists(result.body);
      });
  }

  getStaredGists() {
    API.get(`${this.baseUrl()}/starred`)
      .set(this._headers)
      .end((error, result) => this.gistsStore.setStarsOnGists(result.body));
  }

  getGist(id: string) {
    this.uiStore.loading = true;
    API.get(`${this.baseUrl()}/${id}`)
      .set(this._headers)
      .end((error, result) => {
        this.uiStore.loading = false;
        this.getComments(id);
        this.gistsStore.setCurrentGist(result.body, true);
      });
  }

  starGist(id: string) {
    this.uiStore.loading = true;
    API.put(`${this.baseUrl()}/${id}/star`)
      .set(this._headers)
      .end((error) => {
        this.uiStore.loading = false;
        this.gistsStore.star(id);
        this.notificationsStore.addNotification('success', 'Star', this.gistsStore.current.description + ' starred');
      });
  }

  unStarGist(id: string) {
    this.uiStore.loading = true;
    API.del(`${this.baseUrl()}/${id}/star`)
      .set(this._headers)
      .end((error) => {
        this.uiStore.loading = false;
        this.gistsStore.unStar(id);
        this.notificationsStore.addNotification('success', 'Star removed', 'From: ' + this.gistsStore.current.description);
      });
  }

  deleteGist(id: string) {
    this.uiStore.loading = true;
    API.del(`${this.baseUrl()}/${id}`)
      .set(this._headers)
      .end((error) => {
        this.uiStore.loading = false;
        this.gistsStore.deleteGist(id);
      });
  }

  updateGist(id: string) {
    this.uiStore.loading = true;
    API.patch(`${this.baseUrl()}/${id}`)
      .set(this._headers)
      .send(this.gistsStore.localEdit)
      .end((error, result) => {
        this.uiStore.loading = false;
        this.gistsStore.setCurrentGist(result.body, true);
      });
  }

  getUser() {
    this.uiStore.loading = true;
    API.get(this.baseUrl('user'))
      .set(this._headers)
      .end((error, result) => {
        this.uiStore.loading = false;
        this.userStore.setUser(result.body);
        this.notificationsStore.addNotification('info', 'Welcome', result.body.name, null);
      });
  }

  getComments(id: string) {
    this.uiStore.loading = true;
    API.get(`${this.baseUrl()}/${id}/comments`)
      .set(this._headers)
      .end((error, result) => {
        this.uiStore.loading = false;
        this.gistsStore.setComments(id, result.body);
      });
  }

  addComment(id: string, body: string) {
    this.uiStore.loading = true;
    API.post(`${this.baseUrl()}/${id}/comments`)
      .set(this._headers)
      .send({ body })
      .end((error, result) => {
        this.uiStore.loading = false;
        this.getComments(id);
      });
  }

}
