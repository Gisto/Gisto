import { Component } from '@angular/core';
import { UserStore } from '../../../store/user';
import { SettingsStore } from '../../../store/settings';
import { Router} from '@angular/router';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(private userStore: UserStore, private settings: SettingsStore, private router: Router) {}

  logOut() {
    console.log('%c LOG-out ', 'background: #555; color: tomato');
    this.settings.logOut();
    this.router.navigate(['/login']);
  }

}
