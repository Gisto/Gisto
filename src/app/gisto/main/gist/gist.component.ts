import { Component } from '@angular/core';
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

  public showMenu: number = null;
  public showMarkDown: number = null;

  constructor(public gistStore: GistsStore,
              public uiStore: UiStore,
              public settingsStore: SettingsStore) {
  }

  showMenuForFile = (fileIndex: number) => {
    this.showMenu = this.showMenu !== fileIndex ? this.showMenu = fileIndex : this.showMenu = null;
  }

  toggleEditOrSaveMode = () => {
    this.uiStore.isEdit ? this.uiStore.unsetModeToEdit() : this.uiStore.setModeToEdit();
  }

  toggleFileContent = (gistId: string, fileName: string) => {
    this.gistStore.expandCollapseFile(gistId, fileName);
  }

  toggleMarkDown = (fileIndex: number) => {
    this.showMarkDown = this.showMarkDown !== fileIndex ? this.showMarkDown = fileIndex : this.showMarkDown = null;
  }

}
