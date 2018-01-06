import { Component } from '@angular/core';
import { GithubApiService } from '../../../github-api.service';
import { GistsStore } from '../../../store/gists';
import { values } from 'lodash/fp';
import { Router } from '@angular/router';

@Component({
  selector: 'sidebar',
  template: `
    <gist-list>
      <gist-item routerLink="/gist/{{ gist.id }}"
                 routerLinkActive="active"
                 *ngFor="let gist of gistStore.gists | searchFilter: gistStore.filter | sortBy: 'created' : 'DESC'"
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

  constructor(public gistStore: GistsStore, private githubApiService: GithubApiService, private router: Router) {}

  onClick(id) {
    this.githubApiService.getGist(id);
  }

  isActive = (id) => this.router.isActive('/gist/' + id, true);

}
