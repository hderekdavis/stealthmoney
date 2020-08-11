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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private backendService: BackendService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let httpParams = new HttpParams().append('transactionId', params.get('transactionId'));
      this.apiService.get('/transaction', httpParams).subscribe((result: any) => {
        this.transaction = result[0];
  
        this.transaction.amount = Math.abs(this.transaction.amount);
      });
    });
    this.backendService.getBusinessLocation().subscribe( result => {
      this.addressData = result;
    });
    this.backendService.getTransactionCategories().subscribe( result => {
      this.transactionCategories = result;
    });
  }

  back() {
    if (this.transaction.type === 'income') {
      this.router.navigate(['/income']);
    } else {
      this.router.navigate(['/expense', this.transaction.categoryId]);
    }
  }

  updateTransaction(value) {
    this.transaction.categoryId = value;
    this.backendService.updateTransaction(this.transaction)
      .subscribe( result => this.toastr.success('Transaction updated!', 'Transaction Update'));
  }
}
