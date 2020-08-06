import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { AddressFormComponent } from '../address-form/address-form.component';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @ViewChildren(AddressFormComponent) addresses: QueryList<AddressFormComponent>
  private ngUnsubscribe = new Subject();
  settingsForm: FormGroup;
  addressForms = [];
  businessID;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private backendService: BackendService) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      email: [null, Validators.required],
      password: [null],
      businessName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      legalEntity: [null, Validators.required],
    });
    this.addressForms.push(1);
    let request = this.backendService.getBusinessSettings();
    request.subscribe( response => {
      this.settingsForm = this.fb.group({
        email: [response.business.email, Validators.required],
        password: [null],
        businessName: [response.business.businessName, Validators.required],
        phoneNumber: [response.business.phoneNumber, Validators.required],
        legalEntity: [response.business.legalEntity, Validators.required],
      });
      let amount = response.addresses.length;
      for (let i = 1; i < amount; i++) {
        this.addressForms.push(i + 1);
      }
      this.businessID = response.business.businessID;
    });
    request.toPromise().then( response => {
      response.addresses.forEach( (address, index) => {
        let form = this.addresses.toArray()[index].addressForm;
        form.controls['addressFirstLine'].setValue(address.addressLine1);
        form.controls['addressSecondLine'].setValue(address.addressLine2);
        form.controls['city'].setValue(address.city);
        form.controls['state'].setValue(address.state);
        form.controls['zipcode'].setValue(address.zip);
        form.controls['businessVertical'].setValue(address.vertical);
      });
    })
  }

  addAddress() {
    this.addressForms.push(this.addressForms.length);
  }

  validForms() {
    return this.addresses.toArray().every(this.isValidForm) && this.settingsForm.valid;
  }

  isValidForm(addressComponent: AddressFormComponent) {
    return addressComponent.addressForm.valid;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  modifyBankAccounts() {}

  submit() {
    if(this.validForms()) {
      const email = this.settingsForm.controls['email'].value;
      const password = this.settingsForm.controls['password'].value;
      const businessName = this.settingsForm.controls['businessName'].value;
      const phoneNumber = this.settingsForm.controls['phoneNumber'].value;
      const legalEntity = this.settingsForm.controls['legalEntity'].value;
      let addresses = [];
      this.addresses.forEach( (addressComponent: AddressFormComponent) => {
        let form = addressComponent.addressForm;
        addresses.push({
          addressFirstLine: form.controls['addressFirstLine'].value,
          addressSecondLine: form.controls['addressSecondLine'].value,
          city: form.controls['city'].value,
          state: form.controls['state'].value,
          zipcode: form.controls['zipcode'].value,
          businessVertical: form.controls['businessVertical'].value,
        })
      });
      this.backendService.updateSettings(this.businessID, email, password, businessName, phoneNumber, legalEntity, addresses)
        .subscribe(result => this.toastr.success('Settings successfully updated!', 'Settings Updated'));
    } else {
      this.toastr.error('Please complete all of the required fields', 'Invalid Form');
    }
  }

}
