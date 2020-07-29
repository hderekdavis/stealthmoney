import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public form: FormGroup;
  public isSubmitting = false;
  public showForgotPassword = false;
  public isSubmittingForgotPassword = false;

  constructor(
    public fb: FormBuilder,
    public router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  submit() {
    this.router.navigate(['/dashboard']);
  }

  showForgotPasswordComponent() {
    this.showForgotPassword = true;
  }

  forgotPassword() {
    
  }

  backToLogin() {
    this.showForgotPassword = false;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
