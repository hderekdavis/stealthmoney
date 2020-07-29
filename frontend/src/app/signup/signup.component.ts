import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  form: FormGroup;
  showVerifyEmailMessage = false;
  showRequiredText = false;
  showInvalidEmailText = false;
  emailText: string;
  isSubmitting = false;
  isResending = false;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });

    const queryParams$ = this.activatedRoute.queryParams;
  }

  submit() {
    this.router.navigate(['/dashboard']);
  }

  isValidEmail() {
   
  }

  resendEmail() {
    
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
