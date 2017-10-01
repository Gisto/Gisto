import { Component, OnInit } from '@angular/core';
import { GithubApiService } from '../../../github-api.service';

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

  constructor(private githubApiService: GithubApiService) {}
  
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
    this.getGist('98a6b0f17cbdcdc7dd29d061a49561f0');
  }

}
