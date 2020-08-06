import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { filter, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  transaction: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const businessId$ = this.authService.getObservableOfUserInfo()
      .pipe(
        filter((userInfo: any) => userInfo.businessId !== null) // Filter initialization value
      );

    combineLatest(
      this.route.params,
      businessId$
    )
    .pipe(
      switchMap(result => {
        const params = result[0];

        return this.apiService.post('/transaction', {
          businessId: result[1].businessId,
          transactionId: params.transactionId
        });
      })
    )
    .subscribe((result: any) => {
      this.transaction = result[0];
    });
  }

  back() {

  }

}
