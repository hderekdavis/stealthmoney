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
  transactionLocation: any = '';
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
    this.route.paramMap.subscribe(params => {
      this.backendService.getTransaction(params.get('transactionId'))
        .subscribe(transaction => {
          this.transaction = transaction;
          this.transaction.businessLocation = this.transaction.selectedLocation;
          this.formerCategoryId = transaction.categoryId;
          this.transaction.amount = Math.abs(this.transaction.amount);
          if (this.transaction.address) {
            this.transactionLocation = this.transaction.address;
          }
          if (this.transactionLocation !== '' && this.transaction.city) {
            this.transactionLocation += ', '
          }
          if (this.transaction.city) {
            this.transactionLocation += this.transaction.city;
          }
          if (this.transactionLocation !== '' && this.transaction.region) {
            this.transactionLocation += ', '
          }
          if (this.transaction.region) {
            this.transactionLocation += this.transaction.region;
          }
          if (this.transactionLocation === '') {
            this.transactionLocation = 'N/A';
          }
          this.backendService.getTransactionCategories(this.transaction.selectedLocation).subscribe(result => {
            this.transactionCategories = result;
          });
      })
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

  updateBusinessLocation(value) {
    this.transaction.businessLocation = value;
    this.backendService.updateTransaction(this.transaction)
      .subscribe( result => this.toastr.success('Transaction updated!', 'Transaction Update'));
  }
}
