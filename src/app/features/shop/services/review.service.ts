import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Service()
export class ReviewService {
  private readonly httpClient = inject(HttpClient);

  getProductReviews(productId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `products/${productId}/reviews`);
  }

  addReview(productId: string, data: { review: string; rating: number }): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `products/${productId}/reviews`, data);
  }

  deleteReview(reviewId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `reviews/${reviewId}`);
  }
}