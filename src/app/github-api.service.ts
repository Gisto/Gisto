import { Injectable } from '@angular/core';
import { GistsStore } from './store/gists';

@Injectable()
export class GithubApiService {

  private baseUrl = 'https://api.github.com/gists';
  private headers = new Headers();
  private token = localStorage.getItem('api-token') || 'a99a26ae7826e625056f3b78e73d5265123ec593';

  constructor(private gistsStore: GistsStore) {
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', `token ${this.token}`);
  }

  getGists() {
    return fetch(this.baseUrl, {headers: this.headers})
      .then(response => response.json())
      .then(results => this.gistsStore.setGists(results));
  }

  getStaredGists() {
    return fetch(`${this.baseUrl}/starred`, {headers: this.headers})
      .then(response => response.json())
      .then(results => this.gistsStore.setStarsOnGists(results));
  }

  getGist(id) {
    return fetch(`${this.baseUrl}/${id}`, {headers: this.headers})
      .then(response => response.json())
      .then(result => this.gistsStore.setCurrentGist(result));
  }
}
