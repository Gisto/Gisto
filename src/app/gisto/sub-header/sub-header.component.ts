import {Component} from '@angular/core';
import {size} from 'lodash/fp';
import { DomSanitizer } from '@angular/platform-browser';
import {GistsStore} from '../../store/gists';
import {UiStore} from '../../store/ui';
import {GithubApiService} from '../../github-api.service';
import { set } from 'lodash/fp';
import * as CONF from '../../constants/config';

@Component({
  selector: 'sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent {

  size: any = size;

  public showMenu = false;

  constructor(
    public gistStore: GistsStore,
    public uiStore: UiStore,
    private githubApiService: GithubApiService,
    private sanitizer: DomSanitizer
  ) {}

  setOpenOnWebUrl() {
    return `${CONF.defaultEndpointURL}/${this.gistStore.currentGist.username}/${this.gistStore.currentGist.id}`;
  }

  setGithubDesktopUrl() {
    const url = `x-github-client://openRepo/${CONF.defaultEndpointURL}/${this.gistStore.currentGist.id}`;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  setHttpsCloneUrl() {
    return `${CONF.defaultEndpointURL}/${this.gistStore.currentGist.id}.git`;
  }

  setSSHCloneUrl() {
      return `git@gist.github.com:${this.gistStore.currentGist.id}.git`;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  updateFilter(value) {
    this.gistStore.setFilter(value);
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

}
