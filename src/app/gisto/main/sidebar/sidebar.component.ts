import { Component } from '@angular/core';
import { GithubApiService } from '../../../github-api.service';
import { GistsStore } from '../../../store/gists';
import { values, includes, filter, size } from 'lodash/fp';
import { Router } from '@angular/router';
import {minimumCharactersToTriggerSearch} from '../../../constants/config';

@Component({
  selector: 'sidebar',
  template: `
    <gist-list>
      <gist-item routerLink="/gist/{{ gist.id }}"
                 routerLinkActive="active"
                 *ngFor="let gist of gistsList() | sortBy: 'created' : 'DESC'"
                 (click)="onClick(gist.id)">
        <gist-private><icon icon="{{ gist.public ? 'unlock' : 'lock' }}"
                            color="{{ isActive(gist.id) ? '#3F84A8' : '#fff' }}"
                            size="32"></icon></gist-private>
        <star *ngIf="gist.star">
            <icon icon="star-full"
                  color="{{ isActive(gist.id) ? '#3F84A8' : '#fff' }}"
                  size="14"></icon></star>
        <gist-name>
          <a>
            {{ gist.description | cleanTags }}
          </a>
        </gist-name>
      </gist-item>
      
    </gist-list>
  `,
  styleUrls: ['./sidebar.component.scss'],
  providers: [GithubApiService]
})

export class SidebarComponent {

  public values: any = values;

  constructor(
    public gistStore: GistsStore,
    private githubApiService: GithubApiService,
    private router: Router) {}

  onClick(id) {
    this.githubApiService.getGist(id);
  }

  gistsList = () => {
    let snippets = values(this.gistStore.getGists);

    if (!this.gistStore.filter || this.gistStore.filter === '') {
      snippets = values(this.gistStore.getGists);
    }

    if (this.gistStore.filterType === 'freeText' && this.gistStore.filter.length >= minimumCharactersToTriggerSearch) {
      snippets = filter((snippet) =>
        snippet.description.match(this.gistStore.filter) || includes(this.gistStore.filter, snippet.languages), this.gistStore.getGists);
    }

    if (this.gistStore.filterType === 'fileType') {
      snippets = filter((snippet) =>
        includes(this.gistStore.filter, snippet.languages), this.gistStore.getGists);
    }

    if (this.gistStore.filterType === 'tagType') {
      snippets = filter((snippet) =>
        includes(this.gistStore.filter, snippet.tags), this.gistStore.getGists);
    }

    if (this.gistStore.filterType === 'accessType') {
      snippets = filter((snippet) =>
        snippet.public === (this.gistStore.filter === 'public'), this.gistStore.getGists);
    }

    this.gistStore.setFilterCount(size(snippets));

    return snippets;
  }

  isActive = (id) => this.router.isActive('/gist/' + id, true);
}
