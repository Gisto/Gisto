import { Injectable } from '@angular/core';
import { GistsStore } from './store/gists';
import { UiStore } from './store/ui';
import { UserStore } from './store/user';
import * as API from 'superagent';

@Injectable()
export class GithubApiService {

  private token: string = localStorage.getItem('api-token');
  private _headers: object = { 'Content-Type': 'application/json', 'Authorization': `token ${this.token}` };

  constructor(private gistsStore: GistsStore, private uiStore: UiStore, private userStore: UserStore) { }

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
        this.gistsStore.setCurrentGist(result.body);
      });
  }

  starGist(id: string) {
    this.uiStore.loading = true;
    API.put(`${this.baseUrl()}/${id}/star`)
      .set(this._headers)
      .end((error) => {
        this.uiStore.loading = false;
        this.gistsStore.star(id);
      });
  }

  unStarGist(id: string) {
    this.uiStore.loading = true;
    API.del(`${this.baseUrl()}/${id}/star`)
      .set(this._headers)
      .end((error) => {
        this.uiStore.loading = false;
        this.gistsStore.unStar(id);
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

  getUser() {
    this.uiStore.loading = true;
    API.get(this.baseUrl('user'))
      .set(this._headers)
      .end((error, result) => {
        this.uiStore.loading = false;
        this.userStore.setUser(result.body);
      });
  }

}
