import { Injectable } from '@angular/core';
import { tap, finalize, catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private endpoint = environment.api_url;

  private headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  get<T>(path: string, params?: any): Observable<T> {
    this.spinner.show();
    return this.handleResponse(this.httpClient.get<T>(this.endpoint + path, { ...this.headers, params }));
  }

  post<T>(path, data: T): Observable<T> {
    this.spinner.show();
    return this.handleResponse(this.httpClient.post<T>(this.endpoint + path, data, this.headers));
  }

  put<T>(path, data: T): Observable<T> {
    this.spinner.show();
    return this.handleResponse(this.httpClient.put<T>(this.endpoint + path, data, this.headers));
  }

  delete<T>(path, data = null): Observable<T> {
    this.spinner.show();
    return this.handleResponse(this.httpClient.request<T>('DELETE', this.endpoint + path, { ...this.headers, body: data }));
  }

  handleResponse(call) {
    return call.pipe(
      catchError(error => {
        if (error.status === 403) {
          this.router.navigate(['/login']);
          localStorage.removeItem("id_token");
          localStorage.removeItem("access_token");
          localStorage.removeItem("expires_at");
        }
        return throwError(error);
      }),
      finalize(() => this.spinner.hide())
    );
  }
}
