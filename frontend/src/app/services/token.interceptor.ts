import { Injectable } from '@angular/core';
import {  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken = localStorage.getItem("access_token");
    let idToken = localStorage.getItem("id_token");

    if (accessToken && idToken) {
      // Don't send extra headers to Auth0
      if (request.url.includes(environment.auth0_domain)) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
      } else {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
            UserInfo: idToken
          }
        });
      }
    }

    return next.handle(request);
  }
}