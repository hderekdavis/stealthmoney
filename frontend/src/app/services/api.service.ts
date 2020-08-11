import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  ) {}

  get<T>(path: string, params?: any): Observable<T> {
    return this.handleResponse(this.httpClient.get<T>(this.endpoint + path, { ...this.headers, params }));
  }

  post<T>(path, data: T): Observable<T> {
    return this.handleResponse(this.httpClient.post<T>(this.endpoint + path, data, this.headers));
  }

  put<T>(path, data: T): Observable<T> {
    return this.handleResponse(this.httpClient.put<T>(this.endpoint + path, data, this.headers));
  }

  delete<T>(path, data = null): Observable<T> {
    return this.handleResponse(this.httpClient.request<T>('DELETE', this.endpoint + path, { ...this.headers, body: data }));
  }

  handleResponse(call) {
    return call.pipe(
      tap(
        () => { }, // console.log('api service:', data) },
      ),
    );
  }
}
