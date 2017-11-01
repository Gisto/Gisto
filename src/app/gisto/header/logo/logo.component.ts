import { Component } from '@angular/core';

@Component({
  selector: 'logo',
  template: `
    <a routerLink="/main" routerLinkActive="active">&lt;/Gisto&gt;</a>
  `,
  styleUrls: ['./logo.component.scss']
})

export class LogoComponent {}
