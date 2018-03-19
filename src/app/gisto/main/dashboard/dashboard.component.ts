import { Component } from '@angular/core';
import { GistsStore } from '../../../store/gists';
import { GithubApiService } from '../../../github-api.service';
import { size, filter, map, groupBy, flattenDeep, values, keys, head, uniq, compact, flow } from 'lodash/fp';
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
      
      <card [ngStyle]="{ 'background': linearGradient(privateSnippets()), cursor: 'pointer' }"
            (click)="updateFilter('private', 'accessType')" 
            title="Click to show private snippets only">
        <heading>Private snippets</heading>
        <number>
          {{ privateSnippets() }}
        </number>
      </card>

      <card [ngStyle]="{ 'background': linearGradient(publicSnippets()), cursor: 'pointer' }"
            (click)="updateFilter('public', 'accessType')"
            title="Click to show public snippets only">
        <heading>Public snippets</heading>
        <number>
          {{ publicSnippets() }}
        </number>
      </card>
      
    </cards>

    <cards class="tweens">  
      <card>
        <heading>File types of Snippets</heading>
        <pills>
          <pill *ngFor="let language of getLanguages() | sortBy: 'language.length'"
                    [ngStyle]="{ 'background': linearGradient(size(language)) }"
                    (click)="updateFilter(language[0].language, 'fileType')" 
                    [title]="'Click to show snippets that contain ' + language[0].language + ' files'">
            <heading>{{ language[0].language || 'Other' }}</heading>
            <number>
              {{ size(language) }}
            </number>
          </pill>
        </pills>
      </card>

      <card>
        <heading>Starred ({{ size(starredList()) }})</heading>
        <div class="wrap">
          <div class="starred" *ngFor="let snippet of starredList() | sortBy: 'updated' : 'DESC'">
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
              <tag *ngFor="let tag of snippet.tags">
                <a (click)="updateFilter(tag, 'tagType')"
                   [title]="'Click to show snippets that contain ' + tag + ' tag'">{{ tag }}</a>
              </tag>
            </div>
          </div>
        </div>
      </card>
      
      
    </cards>
    
    <cards>
      <card>
        <heading>Tags ({{ size(getTags()) }})</heading>
        <pills>
          <pill *ngFor="let tag of getTags()"
                    (click)="updateFilter(tag, 'tagType')"
                    [title]="'Click to show snippets that contain ' + tag + ' tag'">
            <heading><span class="hash">#</span>{{ head(tag.split('#').slice(1)) }}</heading>
          </pill>
        </pills>
      </card>
      
    </cards>
  `,
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  size: any = size;
  head: any = head;

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

  getTags = () => {
    const tags = map('tags', toJS(this.gistsStore.gists));

    const tagList = flow([
      flattenDeep,
      uniq,
      compact
    ])(tags);

    return tagList.sort();
  }

  starredList = () => filter({ star: true }, this.gistsStore.gists);

  updateFilter = (value, type) => {
    this.gistsStore.filter = value;
    this.gistsStore.filterType = type;
  }
}
