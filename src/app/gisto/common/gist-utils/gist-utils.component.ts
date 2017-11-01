import { Component, Input } from '@angular/core';

@Component({
  selector: 'gist-utils',
  template: `
    <i class="fa {{ icon }} {{ cssClass }}"></i>
    <ng-content></ng-content>
  `,
  styleUrls: ['./gist-utils.component.scss']
})

export class GistUtilsComponent {
  @Input() icon: string;
  @Input() cssClass: string;
}
