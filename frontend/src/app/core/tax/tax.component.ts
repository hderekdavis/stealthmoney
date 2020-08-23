import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  public context: string;
  public netIncome: string;
  public taxValue: number;
  public taxRate: number;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private backendService: BackendService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.netIncome = params['netIncome'];
    })
    this.activatedRoute.params.subscribe(params => {
      this.context = params['context'];
      switch(this.context) {
        case 'local':
          this.backendService.getLocalTax(this.netIncome.toString()).subscribe( result => {
            this.taxValue = result.tax;
            this.taxRate = result.rate; 
          });
          break;
        case 'federal':
          this.backendService.getFederalTax(this.netIncome.toString()).subscribe( result => {
            this.taxValue = result.tax;
            this.taxRate = result.rate; 
          });
          break;
        case 'state':
          this.backendService.getStateTax(this.netIncome.toString()).subscribe( result => {
            this.taxValue = result.tax;
            this.taxRate = result.rate; 
          });
          break;
      }
    });
  }

  back() {
    this.router.navigate(['/dashboard']);
  }

}
