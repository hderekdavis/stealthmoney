import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { PlaidComponent } from './plaid/plaid.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseCategoryComponent } from './expense-category/expense-category.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PlaidGuardService } from '../services/plaid-guard.service';
import { AlreadyLoggedInGuardService } from '../services/already-logged-in-guard.service';
import { TaxComponent } from './tax/tax.component';
import { EstimatedTaxesComponent } from './estimated-taxes/estimated-taxes.component';
import { UnregisterFormComponent } from './unregister-form/unregister-form.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AlreadyLoggedInGuardService]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AlreadyLoggedInGuardService]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AlreadyLoggedInGuardService]
  },
  {
    path: 'dashboard',
    component: EstimatedTaxesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'plaid',
    component: PlaidComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'income',
    component: IncomeComponent,
    canActivate: [AuthGuardService, PlaidGuardService]
  },
  {
    path: 'expense/:categoryId',
    component: ExpenseCategoryComponent,
    canActivate: [AuthGuardService, PlaidGuardService]
  },
  {
    path: 'transaction/:transactionId',
    component: TransactionComponent,
    canActivate: [AuthGuardService, PlaidGuardService]
  },
  {
    path: 'tax/:context',
    component: TaxComponent,
    canActivate: [AuthGuardService, PlaidGuardService]
  },
  {
    path: 'estimated-taxes',
    component: DashboardComponent,
    canActivate: [AuthGuardService, PlaidGuardService]
  },
  {
    path: 'unsubscribe',
    component: UnregisterFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }