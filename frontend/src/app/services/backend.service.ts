import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private api: ApiService) { }

  createBusiness(email: string, businessName: string, phoneNumber: string, legalEntity: string, addresses: any[]): Observable<any> {
    return this.api.post('/business',{ email, businessName, phoneNumber, legalEntity, addresses });
  }
}
