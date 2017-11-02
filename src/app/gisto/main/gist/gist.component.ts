import { Component } from '@angular/core';
import { GistsStore } from '../../../store/gists';
import { UiStore } from '../../../store/ui';
import { SettingsStore } from '../../../store/settings';
import { values } from 'lodash/fp';
import { AceEditorDirective } from 'ng2-ace';

@Component({
  selector: 'gist',
  templateUrl: './gist.component.html',
  styleUrls: ['./gist.component.scss']
})
export class GistComponent {

  values: any = values;

  public showMenu: number = null;
  public showMarkDown: number = null;
  options:any = { maxLines: 1000, printMargin: false };

  constructor(
    public gistStore: GistsStore,
    public uiStore: UiStore,
    public settingsStore: SettingsStore
  ) {}

  showMenuForFile = (fileIndex: number) => {
    this.showMenu = this.showMenu !== fileIndex ? this.showMenu = fileIndex : this.showMenu = null;
  }

  toggleFileContent = (gistId: string, fileName: string) => {
    this.gistStore.expandCollapseFile(gistId, fileName);
  }

  toggleMarkDown = (fileIndex: number) => {
    this.showMarkDown = this.showMarkDown !== fileIndex ? this.showMarkDown = fileIndex : this.showMarkDown = null;
  }

  changeFile(filename, value) {
    this.gistStore.changeLocalDataFile(filename, value);
  }

  changeFileContent(filename, value) {
    this.gistStore.changeLocalDataContent(filename, value);
  }

}
