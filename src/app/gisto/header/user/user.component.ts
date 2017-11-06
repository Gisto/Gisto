import { Component, Input } from '@angular/core';
import { UserStore } from '../../../store/user';
import { SettingsStore } from '../../../store/settings';
import { Router} from '@angular/router';

interface User {
  avatar_url: string;
  name?: string;
  login: string;
}

@Component({
  selector: 'user',
  template: `
    <img src="{{ user.avatar_url }}" alt=""> <span style="margin-left: 5px;" *ngIf="!manage">
      {{ user.name || user.login }}
    </span>
    <gist-utils *ngIf="manage" (click)="showUserMenu=!showUserMenu">
      <a>{{ user.name || user.login }}</a> <i class="fa fa-angle-down" aria-hidden="true"></i>
      <ul *ngIf="showUserMenu">
        <li><a (click)="logOut()"><i class="fa fa-sign-out" aria-hidden="true"></i> Log-out</a></li>
      </ul>
    </gist-utils>
  `,
  styleUrls: ['./user.component.scss']
})

export class UserComponent {

  constructor(public userStore: UserStore, public settings: SettingsStore, private router: Router) {}

  @Input() user: User;
  @Input() manage: boolean;

  public showUserMenu = false;

  logOut() {
    this.settings.logOut();
    this.router.navigate(['/login']);
  }

}
