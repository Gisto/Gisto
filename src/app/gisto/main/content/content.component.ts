import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubApiService } from '../../../github-api.service';
import { GistsStore } from '../../../store/gists';
import { values } from 'lodash/fp';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {

  values: any = values;

  private showMenu = false;
  private showFileContent = true;

  constructor(private githubApiService: GithubApiService,
              private route: ActivatedRoute,
              private gistStore: GistsStore) {
  }

  showMenuForFile = (i) => {
    this.showMenu = this.showMenu !== i ? this.showMenu = i : this.showMenu = false;
  }

  toggleFileContent = (i) => {
    this.showFileContent = this.showFileContent !== i ? this.showFileContent = i : this.showFileContent = false;
  }

}
