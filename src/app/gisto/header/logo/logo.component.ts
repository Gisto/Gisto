import { Component } from '@angular/core';
import { logoText } from '../../../constants/config';

@Component({
  selector: 'logo',
  template: `
    <a routerLink="/main" routerLinkActive="active">{{ logo }}</a>
  `,
  styleUrls: ['./logo.component.scss']
})

export class LogoComponent {
  public logo: string = logoText;
}
