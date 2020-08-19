import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from './backend.service';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    auth0LoginApi = 'https://' + environment.auth0_domain + '/oauth/token';
    auth0SignUpApi = 'https://' + environment.auth0_domain + '/dbconnections/signup';
    auth0LogoutApi = 'https://' + environment.auth0_domain + '/v2/logout?client_id=' + environment.auth0_client_id;
    hasPlaidToken = false;

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private httpClient: HttpClient,
        private backendService: BackendService,
        private spinner: NgxSpinnerService
    ) {}

    public async fetchUserInfo() {
        return await this.backendService.getBusiness().toPromise().then(response => {
            if (response) {
                if (response.plaidAccessToken) {
                    this.hasPlaidToken = true;
                }
            }
            return response;
        });
    }

    login(email:string, password:string): Observable<any>{
        this.spinner.show();
        const body = {
            grant_type: 'password',
            client_id: environment.auth0_client_id,
            audience: 'https://stealthmoney/api',
            username: email,
            password: password,
            scope: 'openid email profile'
        }
        const result = this.httpClient.post(this.auth0LoginApi, body);
        result.pipe(
            tap((data: any) => {
            }),
            catchError( err => {
                this.toastr.error('Error in source. Details: ' + err.error.error_description, 'Error');
                return throwError(err);
            })
        ).toPromise()
            .then(response => this.setSession(response))
            .then(() => this.fetchUserInfo())
            .then(() => this.router.navigate(['/dashboard']))
            .then(() => this.toastr.success('Logged in successfully!', 'Log In'))
            .finally(() => this.spinner.hide())
        return result;
    }

    signup(email:string, password:string, businessName: string, phoneNumber: string, legalEntity: string, addresses: any) {
        this.spinner.show();
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
                if (err.error.message) {
                    this.toastr.error(err.error.message, 'Error');
                } else {
                    this.toastr.error('There was an unknown error with your signup. Please contact us for assistance.', 'Error')
                }
                return throwError(err);
            })
        ).subscribe(response => {
            this.backendService.createBusiness(email, businessName, phoneNumber, legalEntity, addresses)
                .subscribe(() => {
                    this.login(email, password).subscribe(() => console.log('loged in!'));
                })
        });
    }
            
    private setSession(authResult) {
        const expiresAt = moment().add(authResult.expires_in,'second');
        localStorage.setItem('id_token', authResult.id_token);
        localStorage.setItem('access_token', authResult.access_token);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }          

    logout() {
        let redirect;
        if (environment.production) {
            redirect = 'https://clearviewmoney.com/login';
        } else {
            redirect = 'http://localhost:4200/login';
        }
        window.location.href = this.auth0LogoutApi + '&returnTo=' + redirect;
        this.toastr.success('Logged out successfully.', 'Logout');
        localStorage.removeItem("id_token");
        localStorage.removeItem("access_token");
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

    getAccessToken() {
        return localStorage.getItem("access_token");
    }

    getIDToken() {
        return localStorage.getItem("access_token");
    }

    isPlaidSetup() {
        return this.hasPlaidToken;
    }

    setHasPlaidToken(status: boolean) {
        this.hasPlaidToken = status;
    }
}
