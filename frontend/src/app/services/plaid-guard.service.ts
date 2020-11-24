import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlaidGuardService {

  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let status = this.authService.isPlaidSetup();
    if (!status) {
      this.authService.fetchUserInfo().then(result => {
        if(result.plaidAccessToken != null) {
          this.router.navigate([state.url]);
          return true;
        } else {
          this.router.navigate(['/plaid']);
          return false;
        }
      });    
    }
    return status;        
  }
}
