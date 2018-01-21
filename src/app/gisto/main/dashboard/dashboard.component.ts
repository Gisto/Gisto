import { Component } from '@angular/core';
import { GistsStore } from '../../../store/gists';
import { size, filter, map, groupBy, flattenDeep, values, keys } from 'lodash/fp';
import { toJS } from 'mobx';

@Component({
  selector: 'dashboard',
  template: `
    <cards>
      <card>
        <heading>Total snippets</heading>
        <number>{{ totalSnippets() }}</number>
      </card>
      <card [ngStyle]="{'background': linearGradient(publicSnippets())}">
        <heading>Public snippets</heading>
        <number>
          {{ publicSnippets() }}
        </number>
      </card>
      <card [ngStyle]="{'background': linearGradient(privateSnippets())}">
        <heading>Private snippets</heading>
        <number>
          {{ privateSnippets() }}
        </number>
      </card>
      <card [ngStyle]="{'background': linearGradient(starredSnippets())}">
        <heading>Starred snippets</heading>
        <number>
          {{ starredSnippets() }}
        </number>
      </card>
    </cards>
    <cards>
      <card>
        <heading>Language files of Snippets</heading>
        <languages>
          <language *ngFor="let language of getLanguages() | sortBy: 'language[0].language'">
            <heading>{{ language[0].language || 'Other' }}</heading>
            <number>
              {{ size(language) }}
            </number>
          </language>
        </languages>
      </card>
    </cards>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  size: any = size;

  constructor(public gistsStore: GistsStore) { }

  totalSnippets = () => size(this.gistsStore.gists);
  publicSnippets = () => size(filter({ public: true }, this.gistsStore.gists));
  privateSnippets = () => size(filter({ public: false }, this.gistsStore.gists));
  starredSnippets = () => size(filter({ star: true }, this.gistsStore.gists));

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
}
