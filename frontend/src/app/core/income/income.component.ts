import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { filter, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  income: any[] = [];
  totalIncome: number;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.authService.getObservableOfUserInfo()
      .pipe(
        filter((userInfo: any) => userInfo.businessId !== null), // Filter initialization value
        switchMap(userInfo => {
          return this.apiService.post('/income', {
            businessId: userInfo.businessId
          });
        })
      )
      .subscribe((result: any) => {
        this.income = result;

        this.totalIncome = _.sumBy(this.income, 'amount');
      });
  }
  
  back() {
    this.router.navigate(['/dashboard']);
  }

}
