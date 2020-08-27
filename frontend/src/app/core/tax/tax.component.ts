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
    this.activatedRoute.params.subscribe(params => {
      this.context = params['context'];
      switch(this.context) {
        case 'local':
          this.backendService.getLocalTax().subscribe( result => {
            this.netIncome = result.netIncome;
            this.taxValue = result.tax;
            this.taxRate = Math.round(result.rate * 100 * 100) / 100;
          });
          break;
        case 'federal':
          this.backendService.getFederalTax().subscribe( result => {
            this.netIncome = result.netIncome;
            this.taxValue = result.tax;
            this.taxRate = Math.round(result.rate * 100 * 100) / 100;
          });
          break;
        case 'state':
          this.backendService.getStateTax().subscribe( result => {
            this.netIncome = result.netIncome;
            this.taxValue = result.tax;
            this.taxRate = Math.round(result.rate * 100 * 100) / 100;
          });
          break;
      }
    });
  }

  back() {
    this.router.navigate(['/dashboard']);
  }

}
