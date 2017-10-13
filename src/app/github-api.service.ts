import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { GistsStore } from "./store/gists";

@Injectable()
export class GithubApiService {

  private baseUrl = 'https://api.github.com/gists';
  private headers = new Headers();
  private token = localStorage.getItem('api-token');

    constructor(private http: Http, private gistsStore: GistsStore) {
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', `token ${this.token}`);
  }

  getGists() {
    return this.http
      .get(this.baseUrl, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .then(results => this.gistsStore.setGists(results));
  }

  getGist(id): Promise<any[]> {
    return this.http
      .get(`${this.baseUrl}/${id}`, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }
}
