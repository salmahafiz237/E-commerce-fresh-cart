import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Service()
export class AccountService {
  private readonly httpClient = inject(HttpClient);

  getAddresses(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `addresses`);
  }

  addAddress(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `addresses`, data);
  }

  removeAddress(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `addresses/${id}`);
  }

  updateProfile(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `users/updateMe`, data);
  }

  changePassword(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `users/changeMyPassword`, data);
  }
}