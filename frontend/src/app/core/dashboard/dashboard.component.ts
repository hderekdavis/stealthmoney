import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { interval } from 'rxjs';
import { filter, switchMap, startWith } from 'rxjs/operators';

import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  expenseCategories: any[] = []
  totalIncome: number = 0;
  totalExpenses: number = 0;
  netIncome: number = 0;
  federalTax: number = 0;
  stateTax: number = 0;
  localTax: number = 0;
  retry = false;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private backendService: BackendService
  ) { }

  ngOnInit(): void {

    // Every 5 seconds try calling the API to see if transactions are ready
    const timer$ = interval(5000)
      .pipe(
        filter(() => this.retry === true),
        startWith(0),
        switchMap(() => {
          this.retry = false;
          return this.apiService.get('/transactions/all');
        })
      ).subscribe((response: any) => {
        if (response.error_code === 'PRODUCT_NOT_READY') {
          this.retry = true;
        } else {
          this.retry = false;

          const transactions = response;

          if (transactions && transactions.length) {
            this.expenseCategories = transactions.filter(transaction => transaction.type === 'expense');
            this.expenseCategories = _.groupBy(this.expenseCategories, 'category');
            this.expenseCategories = _.mapValues(this.expenseCategories, categoryExpenses => _.sumBy(categoryExpenses, 'amount'));
            this.expenseCategories = Object.keys(this.expenseCategories).map(key => ({
              category: key,
              amount: this.expenseCategories[key],
              categoryId: _.find(transactions, ['category', key]).categoryId
            }));
            
            this.totalIncome = _.sumBy(transactions, transaction => {
              return transaction.type === 'income' ? Math.abs(transaction.amount) : 0;
            });
            this.totalExpenses = _.sumBy(transactions, transaction => {
              return transaction.type === 'expense' ? transaction.amount : 0;
            });
            this.netIncome = this.totalIncome - this.totalExpenses;
            this.backendService.getFederalTax().subscribe( result => this.federalTax = result.tax );
            this.backendService.getLocalTax().subscribe( result => this.localTax = result.tax );
            this.backendService.getStateTax().subscribe( result => this.stateTax = result.tax );
          }
        }
      },
      () => {
        this.toastr.error('Loading your transactions may take a few minutes. Please wait and try reloading the page later.', 'Error');
      });
  }

}
