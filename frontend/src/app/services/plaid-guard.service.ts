import { Injectable } from '@angular/core';
import { Router, NavigationCancel } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlaidGuardService {

  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(): boolean {
    let status = this.authService.isPlaidSetup();
    if (!status) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationCancel) {
          if(!this.router.navigated && this.authService.isLoggedIn()) {
            this.authService.fetchUserInfo().then(() => this.router.navigate([event.url]));
          } else {
            this.router.navigate(['/plaid']);
          }
        }
      });
    }
    return status;        
  }
}
