import { Component, Input } from '@angular/core';

@Component({
  selector: 'button',
  template: `
    <i class="fa {{ icon }}" aria-hidden="true"></i> <ng-content></ng-content>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() icon: string;

}
