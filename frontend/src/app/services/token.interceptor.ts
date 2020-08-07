import { Injectable } from '@angular/core';
import {  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let token = localStorage.getItem("id_token");
    if (token) {
      request = request.clone({
        setHeaders: {
          // Injecting the AuthService caused a circular dependency, so for now just getting the id_token "manually"
          Authorization: `Bearer ${localStorage.getItem("id_token")}`
        }
      });
    }
    return next.handle(request);
  }
}