import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { PlaidLinkHandler } from 'ngx-plaid-link/lib/ngx-plaid-link-handler';
import { PlaidConfig } from 'ngx-plaid-link/lib/interfaces';
import { environment } from 'src/environments/environment';
import { NgxPlaidLinkService } from 'ngx-plaid-link';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-plaid',
  templateUrl: './plaid.component.html',
  styleUrls: ['./plaid.component.scss']
})
export class PlaidComponent implements AfterViewInit {

  private plaidLinkHandler: PlaidLinkHandler;

  private config: PlaidConfig = {
    ...environment.plaid_default_config,
    onSuccess: this.onSuccess,
    onExit: this.onExit
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private plaidLinkService: NgxPlaidLinkService,
    private spinner: NgxSpinnerService
  ) {}

  ngAfterViewInit() {
    this.spinner.show();
    this.plaidLinkService
      .createPlaid(
        Object.assign({}, this.config, {
          onSuccess: (token, metadata) => this.onSuccess(token, metadata),
          onExit: (error, metadata) => this.onExit(error, metadata),
          onEvent: (eventName, metadata) => this.onEvent(eventName, metadata)
        })
      )
      .then((handler: PlaidLinkHandler) => {
        this.plaidLinkHandler = handler;
        this.open();
      });
  }

  open() {
    this.plaidLinkHandler.open();
  }

  onSuccess(token, metadata) {
    this.authService.setHasPlaidToken(true);
    this.apiService.post('/access-token', {
      publicToken: token
    }).subscribe((response: any) => {
      this.router.navigate(['/dashboard']);
      this.spinner.hide();
    });
  }

  onEvent(eventName, metadata) {
    console.log("We got an event:", eventName);
    console.log("We got metadata:", metadata);
  }

  onExit(error, metadata) {
    console.log("We exited:", error);
    console.log("We got metadata:", metadata);
    this.spinner.hide();
  }
}
