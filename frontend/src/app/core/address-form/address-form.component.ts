import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  @Input() addessNumber: string;
  addressForm: FormGroup;
  
  constructor(public fb: FormBuilder,) { }

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      addressFirstLine: [null, Validators.required],
      addressSecondLine: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      zipcode: [null, Validators.required],
      businessVertical: [null, Validators.required],
    });
  }

}
