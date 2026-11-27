import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { WishlistItem, WishlistResponse } from '../models/wishlist.interface';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

const COUNT_KEY = 'wishlistCount';

@Service()
export class WishlistService {
    private readonly httpClient = inject(HttpClient);

    wishlistItems = signal<WishlistItem[]>([]);
    wishlistCount = signal(0);
    wishlistIds = signal<string[]>([]);

    // Single place that updates the number and saves it
    private setCount(count: number): void {
        this.wishlistCount.set(count);
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(COUNT_KEY, String(count));
        }
    }

    // Call on app start: show the saved number immediately (only if logged in)
    restoreCount(): void {
        if (typeof localStorage === 'undefined') return;
        if (!localStorage.getItem('token')) return;

        const saved = Number(localStorage.getItem(COUNT_KEY));
        this.wishlistCount.set(Number.isFinite(saved) ? saved : 0);
    }

    // Get wishlist
    getLoggedUserWishlist(): Observable<WishlistResponse> {
        return this.httpClient.get<WishlistResponse>(environment.baseUrl + 'wishlist').pipe(
            tap(res => {
                const items = res.data ?? [];
                this.wishlistItems.set(items);
                this.wishlistIds.set(items.map(item => item._id || item.id));
                this.setCount(items.length);
            })
        );
    }

    // Add product
    addProductToWishlist(productId: string): Observable<WishlistResponse> {
        return this.httpClient.post(environment.baseUrl + 'wishlist', { productId }).pipe(
            switchMap(() => this.getLoggedUserWishlist())
        );
    }

    // Remove product
    removeProductFromWishlist(productId: string): Observable<WishlistResponse> {
        return this.httpClient.delete(environment.baseUrl + `wishlist/${productId}`).pipe(
            switchMap(() => this.getLoggedUserWishlist())
        );
    }

    // Toggle product
    toggleWishlist(productId: string): Observable<WishlistResponse> {
        return this.isInWishlist(productId)
            ? this.removeProductFromWishlist(productId)
            : this.addProductToWishlist(productId);
    }

    // Check if product exists
    isInWishlist(productId: string): boolean {
        return this.wishlistIds().includes(productId);
    }

    // Reset wishlist on logout
    clearWishlist(): void {
        this.wishlistItems.set([]);
        this.wishlistIds.set([]);
        this.wishlistCount.set(0);
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(COUNT_KEY);
        }
    }
}