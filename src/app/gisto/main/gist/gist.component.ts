import { Component } from '@angular/core';
import { GistsStore } from '../../../store/gists';
import { UiStore } from '../../../store/ui';
import { values } from 'lodash/fp';
import { AceEditorDirective } from 'ng2-ace';
import { syntaxMap } from '../../../constants/syntax';

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
              public uiStore: UiStore) {
  }

  showMenuForFile = (fileIndex: number) =>
    this.showMenu = this.showMenu !== fileIndex ? this.showMenu = fileIndex : this.showMenu = null;

  toggleFileContent = (gistId: string, fileName: string) =>
    this.gistStore.expandCollapseFile(gistId, fileName);

  toggleMarkDown = (fileIndex: number) =>
    this.showMarkDown = this.showMarkDown !== fileIndex ? this.showMarkDown = fileIndex : this.showMarkDown = null;

  changeFile = (filename, value) =>
    this.gistStore.changeLocalDataFile(filename, value);

  changeFileContent = (filename, value) =>
    this.gistStore.changeLocalDataContent(filename, value);

  deleteFile = (filename) =>
    this.gistStore.deleteLocalFile(filename);

  getSyntax = (language) =>
    syntaxMap[language];

}
