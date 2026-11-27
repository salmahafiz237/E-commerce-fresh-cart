import { HttpClient } from '@angular/common/http';
import { inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Service()
export class AuthService {
    private readonly httpClient = inject(HttpClient);
    private readonly platformId = inject(PLATFORM_ID);
    isLogged = signal(false);

    signUp(data:object):Observable<any>{
        return this.httpClient.post(environment.baseUrl + `auth/signup`, data);
    }

    signIn(data:object):Observable<any>{
        return this.httpClient.post(environment.baseUrl + `auth/signin`, data);
    }

    forgetPassword(data:object):Observable<any>{
        return this.httpClient.post(environment.baseUrl + `auth/forgotPasswords`, data);
    }

    verifyResetCode(data:object):Observable<any>{
        return this.httpClient.post(environment.baseUrl + `auth/verifyResetCode`, data);
    }

    resetPassword(data:object):Observable<any>{
        return this.httpClient.put(environment.baseUrl + `auth/resetPassword`, data);
    }

    
    resendResetCode(data: object): Observable<any> {
        return this.httpClient.post(environment.baseUrl + `auth/forgotPasswords`,data);
    }
    

    getUserId(): string | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(payload)).id ?? null;
        } catch {
        return null;
      }
    }
}
