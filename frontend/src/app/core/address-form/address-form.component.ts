import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  @Input() addessNumber: string;
  @Input() isDisabled: string;
  addressForm: FormGroup;
  states = [
    'Alaska',
    'Alabama',
    'Arkansas',
    'Arizona',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Iowa',
    'Idaho',
    'Illinois',
    'Indiana',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Massachusetts',
    'Maryland',
    'Maine',
    'Michigan',
    'Minnesota',
    'Missouri',
    'Mississippi',
    'Montana',
    'North Carolina',
    'North Dakota',
    'Nebraska',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'Nevada',
    'New York',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Puerto Rico',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Virginia',
    'Vermont',
    'Washington',
    'Washington DC',
    'Wisconsin',
    'West Virginia',
    'Wyoming'
  ];
  
  constructor(public fb: FormBuilder,) { }

  ngOnInit(): void {
    let disabled = this.isDisabled === "true";
    this.addressForm = this.fb.group({
      addressFirstLine: [{ value: null, disabled: disabled }, Validators.required],
      addressSecondLine: [{ value: null, disabled: disabled }],
      city: [{ value: null, disabled: disabled }, Validators.required],
      state: [{ value: null, disabled: disabled }, Validators.required],
      county: [{ value: null, disabled: disabled }, Validators.required],
      zipcode: [{ value: null, disabled: disabled }, Validators.required],
      businessVertical: [{ value: null, disabled }, Validators.required],
    });
  }

}
