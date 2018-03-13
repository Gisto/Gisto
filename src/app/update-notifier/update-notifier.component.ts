import {Component, NgZone, OnInit} from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'update-notifier',
  template: `
    <div *ngIf="showUpdateMessage()">{{ updateMessage }}</div>
  `,
  styleUrls: ['./update-notifier.component.scss']
})
export class UpdateNotifierComponent implements OnInit {

  updateMessage = 'Up to date';

  constructor(
    private electronService: ElectronService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.on('message', (event, text, info) => this.setMessage(info, text));
    }
  }

  setMessage(info, text) {
    this.zone.run(() => {
      this.updateMessage = text;
    });
  }

  showUpdateMessage = () => {
    return this.updateMessage && (this.updateMessage !== <string>'Up to date' || this.updateMessage !== <string>'Update not available.');
  }

}
