import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { GithubApiService } from '../github-api.service';
import { SettingsStore } from '../store/settings';

@Component({
  selector: 'gisto',
  template: `
    <header></header>
    <sub-header></sub-header>
    <main></main>
  `,
  styleUrls: ['./gisto.component.scss']
})
export class GistoComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private githubApiService: GithubApiService,
    private settingsStore: SettingsStore,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.settingsStore.isLoggedIn) {
      this.router.navigate(['/login']);
    }

    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      const gistId = params['id'];

      if (gistId) {
        this.githubApiService.getGist(gistId);
      }
    });
  }
}
