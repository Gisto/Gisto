import { Component, Input } from '@angular/core';

@Component({
  selector: 'date',
  template: `
    <span [ngStyle]="style">{{ label }} {{ date | date: format ? format : 'MMM d, y h:mm a' }}</span>
  `,
  styleUrls: ['./date.component.scss']
})
export class DateComponent {

  @Input() date: string;
  @Input() format: string;
  @Input() style: any;
  @Input() label: string;

  constructor() { }

}
