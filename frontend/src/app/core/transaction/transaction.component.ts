import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { filter, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { BackendService } from 'src/app/services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  transaction: any;
  addressData: any;
  transactionCategories:[];
  formerCategoryId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private backendService: BackendService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    combineLatest(
      this.route.paramMap,
      this.backendService.getBusinessLocation()
    ).pipe(
      switchMap(result => {
        const params = result[0];
        this.addressData = result[1]; // TODO: Access token should not be passed to the frontend

        let httpParams = new HttpParams().append('transactionId', params.get('transactionId'));
        return this.apiService.get('/transaction', httpParams);
      }),
      switchMap(result => {
        this.transaction = result[0];
        this.formerCategoryId = result[0].categoryId;
        this.transaction.amount = Math.abs(this.transaction.amount);

        return this.backendService.getTransactionCategories(this.addressData.vertical, this.transaction.type);
      })
    ).subscribe(result => {
      this.transactionCategories = result;
    });
  }

  back() {
    if (this.transaction.type === 'income') {
      this.router.navigate(['/income']);
    } else {
      this.router.navigate(['/expense', this.formerCategoryId]);
    }
  }

  updateTransaction(value) {
    this.transaction.categoryId = value;
    this.backendService.updateTransaction(this.transaction)
      .subscribe( result => this.toastr.success('Transaction updated!', 'Transaction Update'));
  }
}
