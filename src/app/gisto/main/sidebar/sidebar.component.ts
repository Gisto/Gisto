import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor() { }

  gists = [
    {
      name: 'this is a name',
      star: true,
      private: true,
      fork: true,
      tags: ['js', 'es6'],
      files: 3
    },
    {
      name: 'this is gist with some long name that has long title and shit',
      star: false,
      private: true,
      fork: true,
      tags: ['js', 'es6'],
      files: 3,
      active: true
    },
    {
      name: 'some gist here',
      star: true,
      private: true,
      fork: true,
      tags: ['js', 'es6'],
      files: 3
    }
  ];

}
