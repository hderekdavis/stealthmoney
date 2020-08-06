import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.scss']
})
export class ExpenseCategoryComponent implements OnInit {
  expenses: any[] = [];
  totalExpenses: number;
  category: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
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

        return this.apiService.post('/expense-category', {
          businessId: result[1].businessId,
          categoryId: params.categoryId
        });
      })
    )
    .subscribe((result: any) => {
      this.expenses = result;

      this.totalExpenses = _.sumBy(this.expenses, 'amount');

      this.category = this.expenses[0].category;
    });
  }

  back() {
    this.router.navigate(['/dashboard']);
  }
}
