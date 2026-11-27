import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Service()
export class CartService {
    private readonly httpClient = inject(HttpClient);
    cartCount = signal(0);

    addProductCart(productId:string):Observable<any>{
        return this.httpClient.post(environment.baseUrl + `cart`, {
            "productId": productId,
        });
    }

    updateCartProduct(productId:string, count:number):Observable<any>{
        return this.httpClient.put(environment.baseUrl + `cart/${productId}`, {
            count: count,
        });
    }

    getLoggedUserCart():Observable<any>{
        return this.httpClient.get(environment.baseUrl + `cart`);
    }

    removeSpecificCartItem(productId:string):Observable<any>{
        return this.httpClient.delete(environment.baseUrl + `cart/${productId}`);
    }

    clearUserCart():Observable<any>{
        return this.httpClient.delete(environment.baseUrl + `cart`);
    }

    createCashOrder(cartId:string, data:object):Observable<any>{
        return this.httpClient.post(environment.baseUrl + `orders/${cartId}`, data);
    }

    createCheckOut(cartId:string, data:object):Observable<any>{
        return this.httpClient.post(environment.baseUrl + `orders/checkout-session/${cartId}?url=http://localhost:4200/`, data);
    }
}
