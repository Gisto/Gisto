import { Component, Renderer2, OnInit } from '@angular/core';
import { values, size, includes, filter, set, get, keyBy } from 'lodash/fp';
import { minimumCharactersToTriggerSearch } from '../constants/config';
import { GistsStore } from '../store/gists';
import { UiStore } from '../store/ui';
import {GithubApiService} from '../github-api.service';

@Component({
  selector: 'super-search',
  template: `
    <div>
      <icon icon="search" 
            size="32" 
            color="#555"></icon>
      <input #superSearchInput
             id="superSearchInput"
             (keyup)="searchFilters(superSearchInput.value)"
             placeholder="Search"/>

      <div class="suggested-super-results" *ngIf="superSearchInput.value.length > 1">

        <ng-container *ngIf="size(routeType)">
          <!--<h4>App ({{ size(routeType) }})</h4>-->
          <div class="result" *ngFor="let route of routeType;">
            <icon [icon]="route.icon" color="#555"></icon>
            <a (click)="uiStore.superSearch=false;gistStore.current={}" routerLink="/{{ route.route }}">
              {{ route.name }}
            </a>
          </div>
        </ng-container>
        
        <ng-container *ngIf="size(fileType)">
          <!--<h4>File types results ({{ size(fileType) }})</h4>-->
          <div class="result" *ngFor="let snippet of fileType">
            <icon icon="file" color="#555"></icon>
            <a (click)="onClick(snippet)">
              {{ snippet.description | cleanTags }}
            </a>
          </div>
        </ng-container>
        
        <ng-container *ngIf="size(tagType)">
          <!--<h4>Tags results ({{ size(tagType) }})</h4>-->
          <div class="result" *ngFor="let snippet of tagType">
            <icon icon="tag" color="#555"></icon>
            <a (click)="onClick(snippet)">
              {{ snippet.description | cleanTags }}
            </a>
          </div>
        </ng-container>

        <ng-container *ngIf="size(freeText)">
          <!--<h4>Free text results ({{ size(freeText) }})</h4>-->
          <div class="result" *ngFor="let snippet of freeText">
            <icon icon="book" color="#555"></icon>
            <a (click)="onClick(snippet)">
              {{ snippet.description | cleanTags }}
            </a>
          </div>
        </ng-container>

      </div>

    </div>
  `,
  styleUrls: ['./super-search.component.scss']
})

export class SuperSearchComponent implements OnInit {

  get: any = get;
  size: any = size;
  freeText: object[];
  fileType: object[];
  tagType: object[];
  routeType: any;
  onElement: any;

  discoverableRoutes: object[] = [
    {
      nameMatch: ['goto', 'new gist', 'create new', 'new'],
      name: 'Create New Snippet',
      route: '/new',
      icon: 'add'
    },
    {
      nameMatch: ['goto', 'settings', 'configurations'],
      name: 'Settings',
      route: '/settings',
      icon: 'cog'
    },
    {
      nameMatch: ['goto', 'info', 'about', 'gisto'],
      name: 'About Gisto',
      route: '/about',
      icon: 'info'
    },
    {
      nameMatch: ['goto', 'panel', 'dashboard', 'dash', 'main', 'home'],
      name: 'Dashboard',
      route: '/main',
      icon: 'dashboard'
    }
  ];

  constructor(
    public gistStore: GistsStore,
    public uiStore: UiStore,
    private githubApiService: GithubApiService,
    private renderer: Renderer2
  ) {}

  searchFilters = (searchTerm) => {

    if (searchTerm.length < minimumCharactersToTriggerSearch) {
      return false;
    }

    this.routeType = filter((discoverableRoute) =>
      includes(searchTerm, discoverableRoute.nameMatch), this.discoverableRoutes);

    this.freeText = filter((snippet) =>
      snippet.description.match(searchTerm) || includes(searchTerm, snippet.languages), this.gistStore.getGists);

    this.fileType = filter((snippet) =>
      includes(searchTerm, snippet.languages), this.gistStore.getGists);

    this.tagType = filter((snippet) =>
      includes(`#${searchTerm}`, snippet.tags), this.gistStore.getGists);

  }

  onClick = (snippet) => {
    this.uiStore.superSearch = false;
    this.githubApiService.getGist(snippet.id);
  }

  ngOnInit () {
    this.onElement = this.renderer.selectRootElement('#superSearchInput');
    this.onElement.focus();
  }
}
