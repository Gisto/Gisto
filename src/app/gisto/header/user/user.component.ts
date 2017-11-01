import { Component } from '@angular/core';
import { UserStore } from '../../../store/user';
import { SettingsStore } from '../../../store/settings';
import { Router} from '@angular/router';

@Component({
  selector: 'user',
  template: `
    <img src="{{ userStore.user.avatar_url }}"
         alt="">
    <gist-utils (click)="showUserMenu=!showUserMenu">
      <a>{{ userStore.user.name || userStore.user.login }}</a> <i class="fa fa-angle-down" aria-hidden="true"></i>
      <ul *ngIf="showUserMenu">
        <li><a (click)="logOut()"><i class="fa fa-sign-out" aria-hidden="true"></i> Log-out</a></li>
      </ul>
    </gist-utils>
  `,
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(public userStore: UserStore, public settings: SettingsStore, private router: Router) {}

  logOut() {
    this.settings.logOut();
    this.router.navigate(['/login']);
  }

}
