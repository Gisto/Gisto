import { Component } from '@angular/core';
import { GistsStore } from '../../../store/gists';
import { GithubApiService } from '../../../github-api.service';
import { size, filter, map, groupBy, flattenDeep, values, keys, head } from 'lodash/fp';
import { toJS } from 'mobx';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard',
  template: `
    <cards>
      
      <card>
        <heading>Total snippets</heading>
        <number>{{ totalSnippets() }}</number>
      </card>
      
      <card [ngStyle]="{ 'background': linearGradient(publicSnippets()) }">
        <heading>Public snippets</heading>
        <number>
          {{ publicSnippets() }}
        </number>
      </card>
      
      <card [ngStyle]="{ 'background': linearGradient(privateSnippets()) }">
        <heading>Private snippets</heading>
        <number>
          {{ privateSnippets() }}
        </number>
      </card>
      
    </cards>
    <cards>
      
      <card>
        <heading>Language files of Snippets</heading>
        <languages>
          <language *ngFor="let language of getLanguages() | sortBy: 'language.length'" 
                    (click)="updateFilter(language[0].language, 'fileType')">
            <heading>{{ language[0].language || 'Other' }}</heading>
            <number>
              {{ size(language) }}
            </number>
          </language>
        </languages>
      </card>
      
      <card>
        <heading>Starred ({{ size(starredList()) }})</heading>
        <div class="wrap">
          <div class="starred" *ngFor="let snippet of starredList() | sortBy: 'created' : 'DESC'">
            <div>
              <icon icon="{{ snippet.public ? 'unlock' : 'lock' }}" 
                    color="#3F84A8" 
                    size="22"></icon>
            </div>
            <div class="text">
              <a routerLink="/gist/{{ snippet.id }}" 
                 (click)="onClick(snippet.id)">
                  {{ snippet.description | cleanTags }}
              </a>
              <tag *ngFor="let tag of snippet.tags"> {{ tag }}</tag>
            </div>
          </div>
        </div>
      </card>
    </cards>
  `,
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  size: any = size;

  constructor(public gistsStore: GistsStore, private router: Router, private githubApiService: GithubApiService) { }

  onClick(id) {
    this.githubApiService.getGist(id);
  }

  totalSnippets = () => size(this.gistsStore.gists);

  publicSnippets = () => size(filter({ public: true }, this.gistsStore.gists));

  privateSnippets = () => size(filter({ public: false }, this.gistsStore.gists));

  linearGradient = (percentOf) => {
    const percents = (percentOf / this.totalSnippets()) * 100;

    return `linear-gradient(to right, #e5f6ff ${Math.floor(percents)}%, #fff ${Math.floor(percents)}%)`;
  }

  getLanguages = () => {
    const files = map('files', toJS(this.gistsStore.gists));
    const grouped = groupBy('language', flattenDeep(files));

    return map((file) => {
      return {
        language: keys(file),
        ...file
      };
    }, grouped);
  }

  starredList = () => filter({ star: true }, this.gistsStore.gists);

  updateFilter = (value, type) => {
    this.gistsStore.filter = value;
    this.gistsStore.filterType = type;
  }
}
