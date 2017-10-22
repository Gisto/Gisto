import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsStore } from '../store/settings';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private router: Router, private settings: SettingsStore) { }

  goToMain(token) {
    this.settings.setToken(token);
    this.router.navigate(['/main']);
  }
}
