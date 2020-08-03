import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { NgxPlaidLinkModule } from "ngx-plaid-link";
import { PlaidComponent } from './plaid/plaid.component';
import { IncomeComponent } from './income/income.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaidComponent,
    IncomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    NgxPlaidLinkModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
