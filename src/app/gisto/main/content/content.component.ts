import { Component, OnInit } from '@angular/core';
import { GithubApiService } from '../../../github-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  providers: [GithubApiService]
})
export class ContentComponent implements OnInit {

  private singleGist;
  private files = [];
  private showMwnu = false;
  private gistId = '';

  constructor(private githubApiService: GithubApiService, private route: ActivatedRoute) {}

  showMenuForFile = (i) => {
    this.showMwnu = this.showMwnu !== i ? this.showMwnu = i : this.showMwnu = false;
  };

  getGist(id) {
    let files = [];
    this.githubApiService.getGist(id).then( res => {
      this.singleGist = res;
      // Handle files
      Object.keys(this.singleGist.files)
      .forEach((file) => this.files.push(this.singleGist.files[file]));
    });
  }

  ngOnInit(): void {
    this.gistId = this.route.snapshot.params['id'];
    this.getGist(this.gistId);
  }

}
