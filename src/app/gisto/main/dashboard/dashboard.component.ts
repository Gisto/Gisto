import { Component } from '@angular/core';
import { GistsStore } from '../../../store/gists';
import { size, filter } from 'lodash/fp';

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
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(public gistsStore: GistsStore) { }

  totalSnippets = () => size(this.gistsStore.gists);
  publicSnippets = () => size(filter({ public: true }, this.gistsStore.gists));
  privateSnippets = () => size(filter({ public: false }, this.gistsStore.gists));
  starredSnippets = () => size(filter({ star: true }, this.gistsStore.gists));

  linearGradient = (percentOf) => {
    const percents = (percentOf / this.totalSnippets()) * 100;

    return `linear-gradient(to right, #e5f6ff ${Math.floor(percents)}%, #fff ${Math.floor(percents)}%)`;
  };

}
