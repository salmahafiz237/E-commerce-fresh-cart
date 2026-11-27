import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from './../../../../core/services/shop.service';
import { Shop } from '../../../../core/models/shop.interface';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../cart/services/cart.service';
import { WishlistService } from '../../../wishlist/services/wishlist.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-shop-details',
  styleUrl: './shop-details.component.css',
  templateUrl: './shop-details.component.html',
})
export class ShopDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly shopService = inject(ShopService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  product = signal<Shop>({} as Shop);
  isInWishlist = computed(() => this.wishlistService.isInWishlist(this.product().id));

  ngOnInit(): void {
    this.getId();
  }

  getId(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getProductDetails(params.get('id')!);
    });
  }

  getProductDetails(id: string): void {
    this.shopService.getSingleProducts(id).subscribe({
      next: (res) => this.product.set(res.data),
      error: (err) => console.log(err)
    });
  }

  addToCart(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addProductCart(this.product().id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastService.success(res.message, 'FreshCart');
          this.cartService.cartCount.set(res.numOfCartItems);
        }
      }
    });
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