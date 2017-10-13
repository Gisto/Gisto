import { Component, OnInit } from '@angular/core';
import { GithubApiService } from '../../../github-api.service';
import { GistsStore } from '../../../store/gists';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [GithubApiService]
})

export class SidebarComponent implements OnInit {

  gists = [];
  gist = {};

  constructor(private githubApiService: GithubApiService, private gistStore: GistsStore) {}

  getGists() {
    this.githubApiService.getGists().then( res => {
      this.gists = res;
    });
  }

  onClick(id) {
    this.githubApiService.getGist(id).then( res => {
      this.gist = res;
      this.gistStore.setCurrentGist(this.gist);
    });
  }

  ngOnInit(): void {
    this.getGists();
  }

}
