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
  public businessName;
  public state;
  public entity;
  public addresses;

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getDueDates()
      .subscribe(result => this.dueDates = result.results);

    this.backendService.getBusinessSettings()
      .subscribe(result => {
        let states = [];
        this.companyInfo = result.legalEntity.entity;
        this.accountant = result.accountant;
        this.businessName = result.business.businessName;
        this.state = states[0];
        this.entity = result.legalEntity.entity;
        this.addresses = result.addresses;
      });
  }

}
