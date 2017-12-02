import { Component } from '@angular/core';
import { GithubApiService } from '../../../github-api.service';
import { GistsStore } from '../../../store/gists';
import { values } from 'lodash/fp';

@Component({
  selector: 'sidebar',
  template: `
    <gist-list>
      <gist-item routerLink="/gist/{{ gist.id }}"
                 routerLinkActive="active"
                 *ngFor="let gist of values(gistStore.gists) | searchFilter: gistStore.filter | sortBy: 'created' : 'DESC'"
                 (click)="onClick(gist.id)">
        <gist-private><i class="fa {{ gist.public ? 'fa-unlock' : 'fa-lock' }}" aria-hidden="true"></i></gist-private>
        <star *ngIf="gist.star"><i class="fa fa-star" aria-hidden="true"></i></star>
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

  constructor(public gistStore: GistsStore, private githubApiService: GithubApiService) {}

  onClick(id) {
    this.githubApiService.getGist(id);
  }

}
