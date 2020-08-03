import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    tokenSubject = new Subject<string>();
    auth0LoginApi = 'https://' + environment.auth0_domain +'/oauth/token';
    userInfo = {
        businessId: 1 // TODO: Set this after logging in or signing up
    }

    constructor(
        private httpClient: HttpClient,
        public router: Router
    ) {
    }

    login(email:string, password:string ) {
        const body = {
            grant_type: 'password',
            client_id: environment.auth0_client_id,
            audience: 'https://stealthmoney/api',
            username: email,
            password: password,
            scope: 'opendid email profile'
        }
        this.httpClient.post(this.auth0LoginApi, body)
        .pipe(
            tap((data: any) => {
                console.log('Logged in successfully!');
            }),
            catchError( err => {
                console.log('Error in source. Details: ' + err.error.error_description);
                return throwError(err);
            })
        ).subscribe(response => {
            this.setSession(response);
            this.router.navigate(['/dashboard']);
        });
    }
            
    private setSession(authResult) {
        const expiresAt = moment().add(authResult.expires_in,'second');
        localStorage.setItem('id_token', authResult.access_token);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
        this.tokenSubject.next(authResult.access_token);
    }          

    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    getToken(): Observable<string> {
        return this.tokenSubject;
    }
  
    setUserInfo(businessId: number) {
        // this.userInfo.businessId = businessId;
    }

    getUserInfo() {
        return this.userInfo;
    }
}
