import { Component } from '@angular/core';
import { size } from 'lodash/fp';
import { DomSanitizer } from '@angular/platform-browser';
import { GistsStore } from '../../store/gists';
import { UiStore } from '../../store/ui';
import { GithubApiService } from '../../github-api.service';
import { set, compact, uniq, startCase, get, flattenDeep, map, flow, filter, isNumber } from 'lodash/fp';
import * as CONF from '../../constants/config';
import { toJS } from 'mobx';
import { SettingsStore } from '../../store/settings';

@Component({
  selector: 'sub-header',
  template: `
    <sub-controlls *ngIf="uiStore.sideBar">
      <search>
        <div><icon icon="search" size="20" color="#3F84A8"></icon></div>
        <span *ngIf="gistStore.filterType!=='freeText'"
              class="search-type-label">
        Search by <b>{{ startCase(gistStore?.filterType) }}</b> ({{ gistStore?.getFilterCount }})
      </span>
        <input type="search"
               [value]="gistStore.filter"
               placeholder="{{ uiStore.loading ? 'Loading...' : 'search ' + size(gistStore.gists) + ' gists' }}"
               #searchBox
               (keyup)="updateFilter(searchBox.value, 'freeText')"
               (blur)="newGistText=true"
               (focus)="newGistText=false;showSuggestions=true"/>
        <div *ngIf="showSuggestions && gistStore.filterType==='freeText' && searchBox.value.length >= 2"
             class="search-suggestions">
          <a class="close" (click)="showSuggestions=false">
            <icon icon="cancel" size="20" color="#3F84A8"></icon>
          </a>
          <p>Tags</p>
          <ul>
            <li *ngFor="let tag of getTags()">
              <a (click)="updateFilter(tag, 'tagType');showSuggestions=false"
                 [title]="'Click to show snippets that contain ' + tag + ' tag'">{{ tag }}</a>
            </li>
          </ul>
        </div>
      </search>
      <button icon="add"
              size="22"
              color="white"
              routerLink="/new">
        <span *ngIf="newGistText">New gist</span>
      </button>
    </sub-controlls>

    <ng-container *ngIf="gistStore.current.id">

      <gist-utils *ngIf="gistStore.current.fork.id"
                  icon="fork"
                  size="20"
                  color="#3F84A8" (click)="forkDropdown=!forkDropdown">
        <div class="drop fork" *ngIf="forkDropdown">
          <p>Fork of:</p>
          <user [user]="gistStore.current.fork.owner"></user>
          <date [date]="gistStore.current.fork.created_at"
                label="Created:"
                [ngStyle]="{ 'display': 'block', 'margin': '0 0 0 40px', 'font-size': '10px' }">
          </date>
          <date [date]="gistStore.current.fork.updated_at"
                label="Updated:"
                [ngStyle]="{ 'display': 'block', 'margin': '0 0 0 40px', 'font-size': '10px' }">
          </date>
          <span [ngStyle]="{ 'display': 'block', 'margin': '0 0 0 40px' }">
        <icon icon="commit" size="20" color="#3F84A8"></icon> {{ gistStore.current.fork.id }}
      </span>
        </div>
      </gist-utils>

      <gist-title title="{{ gistStore.current.description }} {{ gistStore.current.tags && gistStore.current.tags.join(', ') }}">

        <div *ngIf="uiStore.editMode; then editDescription else showDescription"></div>
        <ng-template #editDescription>
          <strong *ngIf="uiStore.editMode">
            Edit description:
          </strong>
          <input #description
                 (keyup)="changeLocalDescription(description.value)"
                 placeholder="untitled"
                 [value]="gistStore.current.description" />
        </ng-template>
        <ng-template #showDescription>
      <span class="language" *ngFor="let language of uniq(gistStore.current.languages)">
        <span *ngIf="language"
              (click)="updateFilter(language, 'fileType')">{{ language }}</span>
      </span>
          {{ gistStore.current.description | cleanTags }}
          &nbsp;
          <title-tag *ngFor="let tag of gistStore.current.tags">
            <a (click)="updateFilter(tag, 'tagType')">{{ tag }}</a>
          </title-tag>
        </ng-template>

      </gist-title>

      <gist-utils *ngIf="uiStore.isEdit"
                  icon="check"
                  color="#5F9EA0"
                  (click)="save(gistStore.current.id)"
                  cssClass="color-success">
      </gist-utils>

      <gist-utils icon="{{ uiStore.isEdit ? 'cancel' : 'edit' }}"
                  color="{{ uiStore.isEdit ? 'red' : '#3F84A8' }}"
                  (click)="toggleEditOrSaveMode()"
                  cssClass="{{ uiStore.isEdit ? 'color-danger' : 'color-success'}}">
      </gist-utils>

      <gist-utils (click)="uiStore.isEdit && toggleFileMenu()"
                  icon="file"
                  color="#5F9EA0"
                  cssClass="color-regular">
        {{ uiStore.isEdit ? size(gistStore.localEdit.files) : size(gistStore.current.files) }}
        <icon icon="{{ showFileMenu ? 'arrow-up' : 'arrow-down' }}"
              size="12"
              *ngIf="uiStore.isEdit"
              color="#3F84A8"></icon>
        <ul *ngIf="showFileMenu">
          <li (click)="addNewFile()">Add new file</li>
        </ul>
      </gist-utils>

      <gist-utils icon="{{ gistStore.current.public ? 'unlock' : 'lock'}}"
                  color="#3F84A8">
      </gist-utils>

      <gist-utils (click)="deleteGist(gistStore.current.id)"
                  icon="delete"
                  color="#FF6347"
                  cssClass="color-danger">
      </gist-utils>

      <gist-utils (click)="toggleComments()" icon="chat" color="#3F84A8">
        {{ size(gistStore.current.comments) }}
      </gist-utils>

      <gist-utils icon="{{ gistStore.current.star ? 'star-full' : 'star-empty' }}" color="#3F84A8"
                  (click)="gistStore.current.star ? unStar(gistStore.current.id) : star(gistStore.current.id)">
      </gist-utils>

      <gist-utils (click)="toggleMenu()" icon="ellipsis" color="#3F84A8">
        <ul *ngIf="showMenu">
          <li (click)="toggleEditOrSaveMode()">{{ uiStore.isEdit ? 'Cancel Edit' : 'Edit' }}</li>
          <li><a external [href]="setOpenOnWebUrl()">Open on web</a></li>
          <li>Download</li>
          <li CopyToClipBoard="{{ gistStore.currentGist.id }}">Copy Gist ID to clipboard</li>
          <li CopyToClipBoard="{{ gistStore.currentGist.html_url }}">Copy Gist URL to clipboard</li>
          <li CopyToClipBoard="{{ setHttpsCloneUrl() }}">Copy HTTPS clone URL to clipboard</li>
          <li CopyToClipBoard="{{ setSSHCloneUrl() }}">Copy SSH clone URL to clipboard</li>
          <li><a [href]="setGithubDesktopUrl()">Open in GitHub desktop</a></li>
          <li class="color-danger">Delete</li>
        </ul>
      </gist-utils>

    </ng-container>
  `,
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent {

  size: any = size;
  compact: any = compact;
  uniq: any = uniq;
  startCase: any = startCase;
  get: any = get;

  public showMenu = false;
  public showFileMenu = false;
  public newGistText = true;
  public showSuggestions = false;

  constructor(
    public gistStore: GistsStore,
    public uiStore: UiStore,
    private githubApiService: GithubApiService,
    private sanitizer: DomSanitizer,
    private settingsStore: SettingsStore
  ) {}

  setOpenOnWebUrl() {
    return `${this.settingsStore.getGistUrl}/${this.gistStore.currentGist.username}/${this.gistStore.currentGist.id}`;
  }

  setGithubDesktopUrl() {
    const url = `x-github-client://openRepo/${this.settingsStore.getGistUrl}/${this.gistStore.currentGist.id}`;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  setHttpsCloneUrl() {
    return `${this.settingsStore.getGistUrl}/${this.gistStore.currentGist.id}.git`;
  }

  setSSHCloneUrl() {
      return `git@gist.github.com:${this.gistStore.currentGist.id}.git`;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleFileMenu() {
    this.showFileMenu = !this.showFileMenu;
  }

  updateFilter(value, type) {
    this.gistStore.setFilter(value, type);
  }

  toggleEditOrSaveMode() {
    if (this.uiStore.isEdit) {
      this.uiStore.unsetModeToEdit();
      this.gistStore.clearLocalData();
    } else {
      this.uiStore.setModeToEdit();
    }
  }

  toggleComments() {
    this.uiStore.toggleCommentsBar();
  }

  star(id) {
    this.githubApiService.starGist(id);
  }

  unStar(id) {
    this.githubApiService.unStarGist(id);
  }

  deleteGist(id) {
    this.githubApiService.deleteGist(id);
  }

  changeLocalDescription(description) {
    this.gistStore.changeLocalDataDescription(description);
  }

  save(id) {
    this.githubApiService.updateGist(id);
    this.toggleEditOrSaveMode();
  }

  getTags = () => {
    const tags = map('tags', toJS(this.gistStore.gists));

    const tagList = flow([
      flattenDeep,
      uniq,
      compact,
      filter((tag) => tag.match(this.gistStore.filter))
    ])(tags);

    return tagList.sort();
  }

  addNewFile = () => this.gistStore.addNewFileToLocalEdit();

}
