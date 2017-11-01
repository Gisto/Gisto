import {Component} from '@angular/core';
import {GistsStore} from '../../store/gists';
import {UiStore} from '../../store/ui';
import {size} from 'lodash/fp';
import {GithubApiService} from '../../github-api.service';
import {set} from 'lodash/fp';

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
    private githubApiService: GithubApiService
  ) {}

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
