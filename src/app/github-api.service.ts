import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GithubApiService {

  private baseUrl = 'https://api.github.com/gists';
  private headers = new Headers();

  constructor(private http: Http) {
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", "token ad7a93c89089965ce996955c3e9acf53d9d4da63");
  }

  getGists(): Promise<any[]> {
    return this.http
      .get(this.baseUrl, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  };

  getGist(id): Promise<any[]> {
    return this.http 
      .get(`${this.baseUrl}/${id}`, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  };
}