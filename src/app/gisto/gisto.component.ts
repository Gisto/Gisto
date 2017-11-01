import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gisto',
  template: `
    <header></header>
    <sub-header></sub-header>
    <main></main>
  `,
  styleUrls: ['./gisto.component.scss']
})
export class GistoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
