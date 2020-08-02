import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AddressFormComponent } from '../address-form/address-form.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  @ViewChildren(AddressFormComponent) addresses: QueryList<AddressFormComponent>
  private ngUnsubscribe = new Subject();
  signupForm: FormGroup;
  showVerifyEmailMessage = false;
  showRequiredText = false;
  showInvalidEmailText = false;
  emailText: string;
  isSubmitting = false;
  isResending = false;
  addressForms = [];

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
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
    const queryParams$ = this.activatedRoute.queryParams;
  }

  onSubmit() {
    this.validateForms();
    // this.router.navigate(['/dashboard']);
  }

  addAddress() {
    this.addressForms.push(this.addressForms.length);
  }

  validateForms() {
    if (this.addresses.toArray().every(this.isValidForm) && this.signupForm.valid) {
      this.toastr.success('Your form is valid', 'Sign Up');
    } else {
      this.toastr.error('Please complete all of the required fields', 'Invalid Form');
    }
  }

  isValidForm(addressComponent: AddressFormComponent) {
    return addressComponent.addressForm.valid;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
