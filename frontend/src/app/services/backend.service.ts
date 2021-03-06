import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private api: ApiService) { }

  createBusiness(email: string, businessName: string, phoneNumber: string, legalEntity: string, addresses: any[]): Observable<any> {
    return this.api.post('/business',{ email, businessName, phoneNumber, legalEntity, addresses });
  }

  getBusinessSettings(): Observable<any> {
    return this.api.get('/business/settings');
  }

  getBusiness(): Observable<any> {
    return this.api.get('/business');
  }

  updateSettings(businessID: string, email: string, password: string, businessName: string, phoneNumber: string, legalEntity: string, addresses: any[]): Observable<any> {
    return this.api.post('/business/settings',{ businessID, email, password, businessName, phoneNumber, legalEntity, addresses });
  }

  sendResetLink(email: string): Observable<any> {
    return this.api.post('/reset-password',{ email });
  }

  getTransactionCategories(businessLocationID: string): Observable<any> {
    let httpParams = new HttpParams().append('businessLocationID', businessLocationID);
    return this.api.get('/transactions/categories', httpParams);
  }

  getBusinessLocation(): Observable<any> {
    return this.api.get('/location');
  }

  updateTransaction(transaction: any): Observable<any> {
    return this.api.put('/transactions', { transaction: transaction });
  }

  hasPlaidToken(): Observable<any> {
    return this.api.get('/has-plaid-token');
  }

  getLocalTax(): Observable<any> {
    return this.api.get('/taxes/local');
  }

  getStateTax(): Observable<any> {
    return this.api.get('/taxes/state');
  }

  getFederalTax(): Observable<any> {
    return this.api.get('/taxes/federal');
  }

  getDueDates(): Observable<any> {
    return this.api.get('/taxes/due-dates');
  }

  unsubscribe(email: string): Observable<any> {
    return this.api.post('/unsubscribe', { email: email });
  }

  getTransaction(transactionID: string): Observable<any> {
    return this.api.get('/transactions/' + transactionID);
  }

  getLegalEntities(): Observable<any> {
    return this.api.get('/entities');
  }

  registerUserLoggedIn(): Observable<any> {
    return this.api.post('/login', {});
  }
}
