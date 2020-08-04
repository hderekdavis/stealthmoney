import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPlaidLinkModule } from "ngx-plaid-link";
import { PlaidComponent } from './plaid/plaid.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaidComponent,
    IncomeComponent,
    ExpenseComponent
  ],
  imports: [
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    NgxPlaidLinkModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
