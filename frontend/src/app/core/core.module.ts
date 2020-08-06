import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CoreRoutingModule } from './core-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { HttpClientModule } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';
import { AddressFormComponent } from './address-form/address-form.component';
import { PlaidComponent } from './plaid/plaid.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseCategoryComponent } from './expense-category/expense-category.component';
import { NgxPlaidLinkModule } from 'ngx-plaid-link';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    SettingsComponent,
    AddressFormComponent,
    PlaidComponent,
    IncomeComponent,
    ExpenseCategoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreRoutingModule,
    HttpClientModule,
    NgxPlaidLinkModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ]
})
export class CoreModule { }
