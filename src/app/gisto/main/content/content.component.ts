import 'rxjs/add/operator/switchMap';
import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GithubApiService } from '../../../github-api.service';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  providers: [GithubApiService]
})
export class ContentComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private singleGist;
  private files = [];
  private showMwnu = false;
  private gistId = '';

  constructor(
    private githubApiService: GithubApiService, private route: ActivatedRoute) { }

  showMenuForFile = (i) => {
    this.showMwnu = this.showMwnu !== i ? this.showMwnu = i : this.showMwnu = false;
  };

  ngOnInit(): void {
    this.subscription = this.route.paramMap
      .switchMap((params: ParamMap) => this.githubApiService.getGist(params.get('id')))
      .subscribe((gist) => {
        this.singleGist = {};
        this.files = [];
        this.singleGist = gist;
        Object.keys(this.singleGist.files)
          .forEach((file) => this.files.push(this.singleGist.files[file]));
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
