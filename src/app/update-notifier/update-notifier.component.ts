import {Component, NgZone, OnInit} from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { UiStore} from '../store/ui';

@Component({
  selector: 'update-notifier',
  template: `
    <div *ngIf="!uiStore.hideUpdater&&electronService.isElectronApp">{{ updateMessage }}<icon (click)="close()" icon="close"></icon></div>
  `,
  styleUrls: ['./update-notifier.component.scss']
})
export class UpdateNotifierComponent implements OnInit {

  updateMessage = 'Up to date';

  constructor(
    public electronService: ElectronService,
    private zone: NgZone,
    public uiStore: UiStore
  ) { }

  ngOnInit() {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.on('message', (event, text, info) => this.setMessage(event, text, info));
    }
  }

  close() {
    return this.uiStore.hideUpdater = true;
  }

  setMessage(event, text, info) {
    this.zone.run(() => {
      this.uiStore.hideUpdater = false;
      this.updateMessage = text;
    });
  }

}
