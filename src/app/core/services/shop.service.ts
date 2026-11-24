import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Shop } from '../models/shop.interface';

@Service()
export class ShopService {
    private readonly httpClient = inject(HttpClient);

    getAllProducts():Observable<any>{
        return this.httpClient.get(environment.baseUrl + 'products');
    }

    getSingleProducts(productId: string):Observable<any>{
        return this.httpClient.get(environment.baseUrl + `products/${productId}`);
    }

    getProductsByBrand(brandId: string): Observable<{ data: Shop[] }> {
        return this.httpClient.get<{ data: Shop[] }>(environment.baseUrl + 'products',{params: {brand: brandId}});
    }
}
