import { Component } from '@angular/core';
import { version } from '../../../helpers/version';
const icon = require('../../../../../build/icon.png');

@Component({
  selector: 'about',
  template: `
    <header></header>
    <div class="content-wrapper" *mobxAutorun>
      <img src="{{ icon }}" width="100" alt=""/>
      <h2>About Gisto</h2>
      <p>Current version <strong>v{{ version }}</strong></p>
      
      <p>
        Gisto is a code snippet manager that runs on GitHub Gists and adds additional features such as searching, 
        tagging and sharing gists while including a rich code editor.
        <br/>
        All your data is stored on GitHub and you can access it from GitHub Gists at any time with changes carrying over to Gisto.
      </p>
      
      <p>
        <a external href="https://github.com/Gisto/Gisto">GitHub</a> | 
        <a external href="https://gistoapp.com">Website gistoapp.com</a> | 
        <a external href="https://github.com/Gisto/Gisto/issues">Issues</a> |
        <a external href="https://twitter.com/gistoapp">Twitter</a>
      </p>
      
    </div>
  `,
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  version: string = version;
  icon: string = icon;

  constructor() { }

}
