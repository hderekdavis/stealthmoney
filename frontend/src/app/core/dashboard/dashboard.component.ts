import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { interval } from 'rxjs';
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
    // Every 5 seconds try calling the API to see if transactions are ready
    interval(5000)
    .pipe(
      startWith(0),
      filter(() => !this.isLoaded),
      switchMap(() => {
        return this.apiService.post('/transactions', { businessId: this.authService.getUserInfo().businessId })
      })
    ).subscribe((response: any) => {
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
    })
  }

}
