import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class CategoryService {
    private readonly httpClient = inject(HttpClient);

    getAllCategories():Observable<any>{
        return this.httpClient.get(environment.baseUrl + 'categories');
    }

    getSingleCategory(categoryId: string):Observable<any>{
        return this.httpClient.get(environment.baseUrl + `categories/${categoryId}`);
    }

    getSubCategoriesOnCategory(categoryId: string):Observable<any>{
        return this.httpClient.get(environment.baseUrl + `categories/${categoryId}/subcategories`);
    }
}