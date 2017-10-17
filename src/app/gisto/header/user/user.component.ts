import { Component } from '@angular/core';
import { UserStore } from '../../../store/user';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(private userStore: UserStore) {}

}
