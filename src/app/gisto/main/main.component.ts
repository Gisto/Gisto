import { Component, OnInit } from '@angular/core';
import { GithubApiService } from '../../github-api.service';
import { UiStore } from '../../store/ui';
import { SettingsStore } from '../../store/settings';
import { GistsStore } from '../../store/gists';

@Component({
  selector: 'main',
  template: `
    <sidebar *ngIf="uiStore.sideBar"></sidebar>
    <content-wrapper>
      <gist *ngIf="gistsStore.current.id"></gist>
      <dashboard *ngIf="!gistsStore.current.id"></dashboard>
    </content-wrapper>
    <comments *ngIf="uiStore.comments"></comments>
  `,
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

  constructor(
    public uiStore: UiStore,
    private githubApiService: GithubApiService,
    private settingsStore: SettingsStore,
    public gistsStore: GistsStore
  ) { }

  ngOnInit() {
    if (this.settingsStore.isLoggedIn) {
      this.githubApiService.getUser();
      this.githubApiService.getGists();
      this.githubApiService.getStaredGists();
    }
  }
}
