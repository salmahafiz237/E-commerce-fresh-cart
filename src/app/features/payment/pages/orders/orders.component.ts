import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { DatePipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Order } from '../../models/order.interface';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  imports: [RouterLink, DatePipe, DecimalPipe],
  selector: 'app-orders',
  styleUrl: './orders.component.css',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly CartService = inject(CartService);
  private readonly platformId = inject(PLATFORM_ID);

  orders = signal<Order[]>([]);
  loading = signal(true);
  error = signal(false);
  expandedId = signal<string | null>(null);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return; // no token on the server

    const userId = this.authService.getUserId();
    if (!userId) {
      this.loading.set(false);
      return;
    }

    this.CartService.getUserOrders(userId).subscribe({
      next: (res) => {
        const sorted = [...res].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.orders.set(sorted);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  toggle(id: string): void {
    this.expandedId.update((cur) => (cur === id ? null : id));
  }

  itemsCount(order: Order): number {
    return order.cartItems.reduce((sum, i) => sum + i.count, 0);
  }
}