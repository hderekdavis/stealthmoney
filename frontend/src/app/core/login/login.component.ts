import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public loginForm: FormGroup;
  public showForgotPasswordForm = false;
  public forgotEmail = '';

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private backendService: BackendService
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setForgotEmail(event) {
    this.forgotEmail = event.srcElement.value;
  }

  sendLink() {
    if (this.forgotEmail) {
      this.backendService.sendResetLink(this.forgotEmail)
        .subscribe(() => this.toastr.success('Reset Password Link sent!', 'Reset Password'))
    } else {
      this.toastr.error('Please enter a valid email', 'Invalid Email');
    }
  }
}
