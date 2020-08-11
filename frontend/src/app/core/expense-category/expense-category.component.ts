import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

import * as _ from 'lodash';
import { HttpParams } from '@angular/common/http';

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
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let httpParams = new HttpParams();
      httpParams.set('categoryId', params.categoryId);
      this.apiService.get('/expense-category', httpParams).subscribe((result: any) => {
        this.expenses = result;
  
        this.totalExpenses = _.sumBy(this.expenses, 'amount');
  
        this.category = this.expenses[0].category;
      });
    });
  }

  back() {
    this.router.navigate(['/dashboard']);
  }
}
