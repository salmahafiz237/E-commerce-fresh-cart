import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { BenifitBrandComponent } from '../../../../shared/ui/benifit-brand/benifit-brand.component';
import { CartService } from '../../../cart/services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  imports: [BenifitBrandComponent, RouterLink],
  selector: 'app-wishlist',
  styleUrl: './wishlist.component.css',
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);

  wishlistItems = this.wishlistService.wishlistItems;
  cartIds = signal<string[]>([]);

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.getLoggedUserWishlist().pipe(
      switchMap(() =>
        this.cartService.getLoggedUserCart().pipe(catchError(() => of(null)))
      )
    ).subscribe({
      next: (cartRes) => {
        const products = cartRes?.data?.products ?? [];
        this.cartIds.set(
          products.map((p: any) => typeof p.product === 'string' ? p.product : p.product._id)
        );
      }
    });
  }

  isInCart(id: string): boolean {
    return this.cartIds().includes(id);
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeProductFromWishlist(productId).subscribe({
      next: () => this.toastService.success('Product removed from wishlist', 'FreshCart')
    });
  }

  addToCart(productId: string): void {
    this.cartService.addProductCart(productId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartService.cartCount.set(res.numOfCartItems ?? this.cartService.cartCount() + 1);
          this.cartIds.update(ids => [...ids, productId]);
          this.toastService.success('Product added to cart', 'FreshCart');
        }
      }
    });
  }
}