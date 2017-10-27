import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubApiService } from '../../../github-api.service';
import { GistsStore } from '../../../store/gists';
import { UiStore } from '../../../store/ui';
import { SettingsStore } from '../../../store/settings';
import { values } from 'lodash/fp';

@Component({
  selector: 'gist',
  templateUrl: './gist.component.html',
  styleUrls: ['./gist.component.scss']
})
export class GistComponent {

  values: any = values;

  private showMenu = false;
  private showFileContent = true;

  constructor(private githubApiService: GithubApiService,
              private route: ActivatedRoute,
              private gistStore: GistsStore,
              private uiStore: UiStore,
              private settingsStore: SettingsStore) {
  }

  showMenuForFile = (i) => {
    this.showMenu = this.showMenu !== i ? this.showMenu = i : this.showMenu = false;
  }

  toggleEditOrSaveMode = () => {
    this.uiStore.isEdit ? this.uiStore.unsetModeToEdit() : this.uiStore.setModeToEdit();
  }

  toggleFileContent = (gistId, fileName) => {
    this.gistStore.expandCollapseFile(gistId, fileName);
  }

}
