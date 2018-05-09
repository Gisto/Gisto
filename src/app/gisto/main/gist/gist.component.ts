import { Component } from '@angular/core';
import { GistsStore } from '../../../store/gists';
import { UiStore } from '../../../store/ui';
import { values } from 'lodash/fp';
import { syntaxMap } from '../../../constants/syntax';
import { editorConfig } from '../../../constants/config';
import { SettingsStore } from '../../../store/settings';

@Component({
  selector: 'gist',
  template: `
    <div *ngFor="let file of filesList(); index as fileIndex;">
      <gist-header>
        <gist-file-icon>
      <span class="fa-stack">
        <i class="fa fa-file-o"></i>
        <strong style="font-size: 8px;" class="fa-stack-1x fa-stack-text file-text">
          {{ file.filename.split('.')[1] || 'txt' }}
        </strong>
      </span>
        </gist-file-icon>

        <gist-file-name>
          <span class="edit" *ngIf="uiStore.editMode">Edit filename:</span>
          <input *ngIf="uiStore.editMode"
                 type="text"
                 (keyup)="changeFile(file, $event, fileIndex)"
                 placeholder="untitled"
                 [value]="file.filename" />
          <span *ngIf="!uiStore.editMode">{{ file.filename }}</span>
        </gist-file-name>

        <div class="gist-language">{{ file.language || 'Text' }}</div>
        <gist-utils
          *ngIf="!uiStore.editMode && file.language && file.language.toLowerCase() === 'markdown'"
          icon="{{ showMarkDown === fileIndex ? 'eye-slash' : 'eye' }}"
          color="#5F9EA0"
          (click)="toggleMarkDown(fileIndex)">
        </gist-utils>
        <gist-utils *ngIf="!uiStore.editMode"
                    icon="{{ showMenu === fileIndex ? 'cancel' : 'ellipsis' }}"
                    color="{{ showMenu === fileIndex ? '#FF6347' : '#5F9EA0' }}"
                    (click)="showMenuForFile(fileIndex)">
          <ul *ngIf="showMenu === fileIndex">
            <li>
              <a external [href]="getFileUrl(file)">
                Open on web
              </a>
            </li>
            <li><a download="{{ file.filename }}" href="{{ file.file_raw }}">Download</a></li>
            <li CopyToClipBoard="{{ file.content }}">Copy file content to clipboard</li>
            <li (click)="deleteFile(file.uuid, fileIndex)" class="color-danger">Delete</li>
          </ul>
        </gist-utils>
        <gist-utils *ngIf="!uiStore.editMode"
          icon="{{ gistStore.gists[gistStore.currentGist.id].files[fileIndex].collapsed ? 'arrow-down' : 'arrow-up' }}"
          color="#5F9EA0"
          (click)="toggleFileContent(gistStore.currentGist.id, fileIndex)">
        </gist-utils>
      </gist-header>
      <gist-body *ngIf="uiStore.editMode || !gistStore.gists[gistStore.currentGist.id].files[fileIndex].collapsed">
        <markdown *ngIf="showMarkDownPreview(file, fileIndex)">
          {{ file.content }}
        </markdown>
        <div ace-editor
             class="editor"
             [(text)]="file.content"
             [durationBeforeCallback]="1000"
             [readOnly]="!uiStore.editMode"
             [mode]="file.language && getSyntax(file.language) || 'text'"
             [theme]="'eclipse'"
             [options]="getOptions(!uiStore.editMode)"
             (textChanged)="changeFileContent(file, $event, fileIndex, content)">
        </div>
      </gist-body>
    </div>
  `,
  styleUrls: ['./gist.component.scss']
})

export class GistComponent {

  values: any = values;
  options: any = editorConfig;

  public showMenu: number = null;
  public showMarkDown: number = null;

  constructor(public gistStore: GistsStore,
              public uiStore: UiStore,
              private settingsStore: SettingsStore) {
  }

  filesList = () => this.uiStore.editMode
    ? this.gistStore.localEdit.files
    : this.gistStore.currentGist.files;

  showMenuForFile = (fileIndex: number) =>
    this.showMenu = this.showMenu !== fileIndex ? this.showMenu = fileIndex : this.showMenu = null;

  toggleFileContent = (gistId: string, index: number) => this.gistStore.expandCollapseFile(gistId, index);

  toggleMarkDown = (fileIndex: number) =>
    this.showMarkDown = this.showMarkDown !== fileIndex ? this.showMarkDown = fileIndex : this.showMarkDown = null;

  showMarkDownPreview = (file, fileIndex) => {
    return !this.uiStore.editMode
      && file.language
      && file.language.toLowerCase() === 'markdown'
      && this.showMarkDown === fileIndex;
  }

  getFileUrl = (file) =>
    `${this.settingsStore.getGistUrl}/${this.gistStore.currentGist.username}/${this.gistStore.currentGist.id }#file-${file.filename }`;

  changeFile = (file, event, index) => {
    if (event) {
      this.gistStore.changeLocalDataFile(file, event.target.value, index);
    }
  };

  changeFileContent = (file, event, index, content) => {
    if (event) {
      this.gistStore.changeLocalDataContent(file, event.target.value, index);
    }
  };

  deleteFile = (uuid, index) => this.gistStore.deleteLocalFile(uuid, index);

  getSyntax = (language) => syntaxMap[language];

  getOptions = (readOnly) => this.options(readOnly);
}
