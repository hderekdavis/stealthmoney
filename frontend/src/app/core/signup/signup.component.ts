import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AddressFormComponent } from '../address-form/address-form.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  @ViewChildren(AddressFormComponent) addresses: QueryList<AddressFormComponent>
  private ngUnsubscribe = new Subject();
  signupForm: FormGroup;
  addressForms = [];

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      businessName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      legalEntity: [null, Validators.required],
    });
    this.addressForms.push(1);
  }

  onSubmit() {
    if(this.validForms()) {
      const email = this.signupForm.controls['email'].value;
      const password = this.signupForm.controls['password'].value;
      const businessName = this.signupForm.controls['businessName'].value;
      const phoneNumber = this.signupForm.controls['phoneNumber'].value;
      const legalEntity = this.signupForm.controls['legalEntity'].value;
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
      this.authService.signup(email, password, businessName, phoneNumber, legalEntity, addresses);
    } else {
      this.toastr.error('Please complete all of the required fields', 'Invalid Form');
    }
  }

  addAddress() {
    this.addressForms.push(this.addressForms.length);
  }

  validForms() {
    return this.addresses.toArray().every(this.isValidForm) && this.signupForm.valid;
  }

  isValidForm(addressComponent: AddressFormComponent) {
    return addressComponent.addressForm.valid;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
