import { Component, Input } from '@angular/core';

@Component({
  selector: 'gist-utils',
  template: `
    <icon [icon]="icon" [rotate]="rotate" [color]="color" cssClass="{{ cssClass }}"></icon>
    <ng-content></ng-content>
  `,
  styleUrls: ['./gist-utils.component.scss']
})

export class GistUtilsComponent {
  @Input() icon: string;
  @Input() color: string;
  @Input() rotate: string;
  @Input() cssClass: string;
}
