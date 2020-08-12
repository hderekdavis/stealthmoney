import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoggedInGuardService {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
