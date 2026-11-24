import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Brand, BrandsResponse, BrandDetailsResponse } from '../pages/models/brand.interface';

@Injectable({
    providedIn: 'root'
})

export class BrandService {
    private readonly httpClient = inject(HttpClient);
    brands(): Observable<BrandsResponse> {
        return this.httpClient.get<BrandsResponse>(environment.baseUrl + 'brands',{params: {limit: 100}});
    }

    brandsDetails(id: string): Observable<BrandDetailsResponse> {
        return this.httpClient.get<BrandDetailsResponse>(environment.baseUrl + `brands/${id}`);
    }
}