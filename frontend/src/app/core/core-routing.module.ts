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

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService, PlaidGuardService]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuardService, PlaidGuardService]
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }