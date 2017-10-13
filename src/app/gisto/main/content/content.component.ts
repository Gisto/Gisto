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

  private showMwnu = false;

  constructor(private githubApiService: GithubApiService,
              private route: ActivatedRoute,
              private gistStore: GistsStore) {
  }

  showMenuForFile = (i) => {
    this.showMwnu = this.showMwnu !== i ? this.showMwnu = i : this.showMwnu = false;
  }

}
