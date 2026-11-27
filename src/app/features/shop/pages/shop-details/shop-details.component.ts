import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from './../../../../core/services/shop.service';
import { Shop } from '../../../../core/models/shop.interface';
import { CartService } from '../../../cart/services/cart.service';
import { WishlistService } from '../../../wishlist/services/wishlist.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.interface';

@Component({
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule],
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
  private readonly authService = inject(AuthService);
  private readonly reviewService = inject(ReviewService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);

  product = signal<Shop>({} as Shop);
  isInWishlist = computed(() => this.wishlistService.isInWishlist(this.product().id));

  // ---------- reviews state ----------
  productId = signal('');
  reviews = signal<Review[]>([]);
  loadingReviews = signal(true);
  submittingReview = signal(false);
  deletingId = signal<string | null>(null);
  confirmDeleteId = signal<string | null>(null);
  hoverRating = signal(0);

  currentUserId = signal<string | null>(null);
  isAdmin = signal(false);

  reviewForm = this.fb.nonNullable.group({
    rating: [0, [Validators.min(1), Validators.max(5)]],
    review: ['', [Validators.required, Validators.minLength(3)]],
  });

  // 5 → 1 star counts for the breakdown bars
  breakdown = computed(() => {
    const list = this.reviews();
    return [5, 4, 3, 2, 1].map((star) => {
      const count = list.filter((r) => r.rating === star).length;
      return { star, count, percent: list.length ? (count / list.length) * 100 : 0 };
    });
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserId.set(this.authService.getUserId());
      try {
        const user = JSON.parse(localStorage.getItem('user') ?? '{}');
        this.isAdmin.set(user.role === 'admin');
      } catch {}
    }
    this.getId();
  }

  getId(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.productId.set(id);
      this.getProductDetails(id);
      this.loadReviews();
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

  // ---------- reviews ----------
  loadReviews(): void {
    this.reviewService.getProductReviews(this.productId()).subscribe({
      next: (res) => {
        const list: Review[] = res.data ?? [];
        this.reviews.set(
          [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
        this.loadingReviews.set(false);
      },
      error: () => this.loadingReviews.set(false),
    });
  }

  setRating(value: number): void {
    this.reviewForm.controls.rating.setValue(value);
    this.reviewForm.controls.rating.markAsTouched();
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }
    this.submittingReview.set(true);

    this.reviewService.addReview(this.productId(), this.reviewForm.getRawValue()).subscribe({
      next: () => {
        this.reviewForm.reset({ rating: 0, review: '' });
        this.submittingReview.set(false);
        this.toastService.success('Thanks! Your review was added', 'FreshCart');
        this.loadReviews();
        this.getProductDetails(this.productId()); // refresh the average rating
      },
      error: () => this.submittingReview.set(false),
    });
  }

  reviewerName(review: Review): string {
    return typeof review.user === 'string' ? 'Customer' : review.user?.name ?? 'Customer';
  }

  canDelete(review: Review): boolean {
    if (this.isAdmin()) return true;
    const ownerId = typeof review.user === 'string' ? review.user : review.user?._id;
    return !!ownerId && ownerId === this.currentUserId();
  }

  deleteReview(id: string): void {
    this.deletingId.set(id);
    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.reviews.update((list) => list.filter((r) => r._id !== id));
        this.deletingId.set(null);
        this.confirmDeleteId.set(null);
        this.toastService.success('Review deleted', 'FreshCart');
        this.getProductDetails(this.productId());
      },
      error: () => this.deletingId.set(null),
    });
  }
}