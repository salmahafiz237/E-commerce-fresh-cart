import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { AuthService } from './features/auth/services/auth.service';
import { WishlistService } from './features/wishlist/services/wishlist.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  imports: [RouterOutlet, NgxSpinnerComponent, NavbarComponent, FooterComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('Ecommerce-fresh-cart');
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        this.authService.isLogged.set(true);
        this.wishlistService.restoreCount();
      }
    }
  }
}