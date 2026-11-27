import { Component, computed, inject, OnInit } from '@angular/core';
import { FlowbiteService } from './../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { CartService } from '../../features/cart/services/cart.service';
import { WishlistService } from '../../features/wishlist/services/wishlist.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit{
  private readonly authService = inject(AuthService);
  private readonly caerService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);

  isLogged = computed(()=> this.authService.isLogged());
  CartNum = computed(()=> this.caerService.cartCount()) ;
  WishlistNum = computed(() => this.wishlistService.wishlistCount());

  constructor(private FlowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.getCartCount();
    this.getWishlistCount();
    this.FlowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

    
  signOut():void{
    this.wishlistService.clearWishlist();
    this.caerService.cartCount.set(0);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.authService.isLogged.set(false);
  }

  getCartCount(): void {
    if (this.isLogged()) {
      this.caerService.getLoggedUserCart().subscribe({
        next: (res) => {
          this.caerService.cartCount.set(
            res.numOfCartItems ?? res.data?.products?.length ?? 0
          );
        }
      });
    }
  }

  getWishlistCount(): void {
    if (this.isLogged()) {
      this.wishlistService.getLoggedUserWishlist().subscribe({
        error: (err) => {
          console.error('Failed to load wishlist', err);
        }
      });
    }
  }
}
