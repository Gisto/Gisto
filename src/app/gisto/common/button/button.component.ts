import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'button',
  template: `
    <i class="fa fa-plus" aria-hidden="true"></i> New gist
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
