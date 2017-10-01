import { Component, OnInit } from '@angular/core';
import { GithubApiService } from '../../../github-api.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [GithubApiService]
})

export class SidebarComponent implements OnInit {

  gists = [];
  gist = {};

  constructor(private githubApiService: GithubApiService) {}

  getGists() {
    this.githubApiService.getGists().then( res => {
      this.gists = res;
    });
  }

  onClick(id) {
    this.githubApiService.getGist(id).then( res => {
      this.gist = res;
    });
  }

  ngOnInit(): void {
    this.getGists();
  }

}
