import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-plaid',
  templateUrl: './plaid.component.html',
  styleUrls: ['./plaid.component.scss']
})
export class PlaidComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onPlaidSuccess(event) {
    console.log('Success: ' + JSON.stringify(event));

    // Save access token
    this.apiService.post('/access-token', {
      publicToken: event.token,
      businessId: this.authService.getUserInfo().businessId
    })
    .subscribe((response: any) => {
      this.router.navigate(['/dashboard']);
    });
  }

  onPlaidEvent(event) {
    console.log('Event: ' + JSON.stringify(event));
  }

  onPlaidExit(event) {
    console.log('Exit: ' + JSON.stringify(event));
  }

  onPlaidLoad(event) {
    console.log('Load: ' + JSON.stringify(event));
  }

  onPlaidClick(event) {
    console.log('Click: ' + JSON.stringify(event));
  }
}
