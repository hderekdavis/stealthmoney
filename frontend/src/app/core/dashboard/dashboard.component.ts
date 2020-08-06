import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { interval, combineLatest } from 'rxjs';
import { filter, switchMap, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  expenseCategories: any[] = []
  transactions: any[] = [];
  totalIncome: number = 0;
  totalExpenses: number = 0;
  isLoaded: boolean;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const businessId$ = this.authService.getObservableOfUserInfo()
      .pipe(
        filter((userInfo: any) => userInfo.businessId !== null) // Filter initialization value
      );

    // Every 5 seconds try calling the API to see if transactions are ready
    const timer$ = interval(5000)
      .pipe(
        startWith(0),
        filter(() => !this.isLoaded)
      );

    combineLatest(
      businessId$,
      timer$
    )
    .pipe(
      switchMap(response => {
        return this.apiService.post('/transactions', { businessId: response[0].businessId });
      })
    )
    .subscribe((response: any) => {
      if (response.error_code !== 'PRODUCT_NOT_READY') {
        this.isLoaded = true;
        this.transactions = response;

        // Storing transactions into a service for other components to access
        

        this.expenseCategories = this.transactions.filter(transaction => transaction.type === 'expense');
        this.expenseCategories = _.groupBy(this.expenseCategories, 'category');
        this.expenseCategories = _.mapValues(this.expenseCategories, categoryExpenses => _.sumBy(categoryExpenses, 'amount'));
        this.expenseCategories = Object.keys(this.expenseCategories).map(key => ({ category: key, amount: this.expenseCategories[key] }));
        this.totalIncome = _.sumBy(this.transactions, transaction => {
          return transaction.type === 'income' ? Math.abs(transaction.amount) : 0;
        });
        this.totalExpenses = _.sumBy(this.transactions, transaction => {
          return transaction.type === 'expense' ? transaction.amount : 0;
        });
      }
    });
  }

}
