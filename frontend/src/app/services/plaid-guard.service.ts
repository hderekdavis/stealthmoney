import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BackendService } from './backend.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlaidGuardService {

  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(): boolean {
    let status = this.authService.isPlaidSetup();
    console.log(status);
    if (!status) {
      this.router.navigate(['/plaid']);
    }
    return status;        
  }
}
