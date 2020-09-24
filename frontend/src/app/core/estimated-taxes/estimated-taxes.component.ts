import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-estimated-taxes',
  templateUrl: './estimated-taxes.component.html',
  styleUrls: ['./estimated-taxes.component.scss']
})
export class EstimatedTaxesComponent implements OnInit {

  public dueDates = [];

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getDueDates()
      .subscribe(result => this.dueDates = result.results);
  }

}
