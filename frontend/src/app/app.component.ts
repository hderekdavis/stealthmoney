import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // This is acting as a guard.
    // If the user has not completed their Plaid account linking they will be redirected to the /plaid route.
    // Doing this here instead of in a guard, b/c the guard depends on the AuthService's asynchronous call to
    // the database to get the user info which doesn't complete in time.
    this.authService.getObservableOfUserInfo()
    .pipe(
      filter((userInfo: any) => userInfo.isPlaidSetup !== null) // Filter initialization value
    ).subscribe(userInfo => {
      if (!userInfo.isPlaidSetup) {
        this.router.navigate(['/plaid']);
      }
    });
  }
}
