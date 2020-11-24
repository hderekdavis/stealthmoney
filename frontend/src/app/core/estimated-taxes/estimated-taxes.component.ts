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
        let states = [];
        let statesString = '';
        result.addresses.forEach(address => {
          if (states.indexOf(address.state) < 0) {
            states.push(address.state);
            statesString += address.state + ', ' 
          }
        })
        this.companyInfo = statesString + result.legalEntity.entity;
        this.accountant = result.accountant;
      });
  }

}
