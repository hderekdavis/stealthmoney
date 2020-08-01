import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public loginForm: FormGroup;
  public isSubmitting = false;
  public showForgotPassword = false;
  public isSubmittingForgotPassword = false;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  onSubmit() {
    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value
    this.authService.login(email, password);
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
