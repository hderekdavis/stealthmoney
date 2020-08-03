import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    tokenSubject = new Subject<string>();
    auth0LoginApi = 'https://' + environment.auth0_domain + '/oauth/token';
    auth0SignUpApi = 'https://' + environment.auth0_domain + '/dbconnections/signup';
    userInfo = {
        businessId: 1 // TODO: Set this after logging in or signing up
    }

    constructor(private httpClient: HttpClient,
                private router: Router,
                private toastr: ToastrService) {}

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
                this.toastr.success('Logged in successfully!', 'Log In');
            }),
            catchError( err => {
                this.toastr.error('Error in source. Details: ' + err.error.error_description, 'Error');
                return throwError(err);
            })
        ).subscribe(response => {
            this.setSession(response);
            this.router.navigate(['/dashboard']);
        });
    }

    signup(email:string, password:string) {
        const body = {
            client_id: environment.auth0_client_id,
            email: email,
            password: password,
            connection: environment.auth0_connection
        }
        this.httpClient.post(this.auth0SignUpApi, body)
        .pipe(
            tap((data: any) => {
            }),
            catchError( err => {
                if (err.error.statusCode === 400) {
                    this.toastr.error('The email is already being used.', 'Error in source');
                } else {
                    this.toastr.error(err.error.error_description, 'Error in source');
                }
                return throwError(err);
            })
        ).subscribe(response => {
            this.login(email, password);
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
