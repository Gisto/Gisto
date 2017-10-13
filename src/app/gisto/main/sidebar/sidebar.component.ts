import { Component } from '@angular/core';
import { GithubApiService } from '../../../github-api.service';
import { GistsStore } from '../../../store/gists';
import { values } from 'lodash/fp';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [GithubApiService]
})

export class SidebarComponent {

  values: any = values;

  constructor(private gistStore: GistsStore, private githubApiService: GithubApiService) {}

  onClick(id) {
    this.githubApiService.getGist(id);
  }

}
