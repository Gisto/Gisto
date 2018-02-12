import { Component } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {GithubApiService} from "../github-api.service";

@Component({
  selector: 'gisto',
  template: `
    <header></header>
    <sub-header></sub-header>
    <main></main>
  `,
  styleUrls: ['./gisto.component.scss']
})
export class GistoComponent {
  constructor(private activatedRoute: ActivatedRoute, private githubApiService: GithubApiService) {}

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      const gistId = params['id'];

      if (gistId) {
        this.githubApiService.getGist(gistId);
      }
    });
  }
}
