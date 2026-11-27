import { Component, computed, inject, input } from '@angular/core';
import { Shop } from '../../../core/models/shop.interface';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../features/cart/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-card',
  styleUrl: './card.component.css',
  templateUrl: './card.component.html',
})
export class CardComponent {
  product = input.required<Shop>();
  
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  isInWishlist = computed(() => this.wishlistService.isInWishlist(this.product().id));
  
  addProduct(id: string): void {
    if (localStorage.getItem('token')) {
      this.cartService.addProductCart(id).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.toastService.success(res.message, 'FreshCart');
            this.cartService.cartCount.set(res.numOfCartItems);
          }
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleWishlist(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }
    const wasInWishlist = this.isInWishlist();
    this.wishlistService.toggleWishlist(this.product().id).subscribe({
      next: () => this.toastService.success(
        wasInWishlist ? 'Product removed from wishlist' : 'Product added to wishlist',
        'FreshCart'
      )
    });
  }
}
