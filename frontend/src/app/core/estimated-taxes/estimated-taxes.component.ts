import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-estimated-taxes',
  templateUrl: './estimated-taxes.component.html',
  styleUrls: ['./estimated-taxes.component.scss']
})
export class EstimatedTaxesComponent implements OnInit {

  public dueDates = [];
  public companyInfo = '';
  public accountant: any;

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getDueDates()
      .subscribe(result => this.dueDates = result.results);

    this.backendService.getBusinessSettings()
      .subscribe(result => {
        this.companyInfo = result.addresses[0].state + ' ' + result.business.legalEntity;
        this.accountant = result.accountant;
      });
  }

}
