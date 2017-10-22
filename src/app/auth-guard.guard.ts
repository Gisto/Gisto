import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {SettingsStore} from "./store/settings";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private settingsStore: SettingsStore, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // currently disabled because of a race condition between mobX and angular

    // const requiresLogin = Boolean(route.data.requiresLogin);
    // if (requiresLogin && !this.settingsStore.isLoggedIn) {
    //   this.router.navigate(['/login']);
    // }

    return true;
  }
}
