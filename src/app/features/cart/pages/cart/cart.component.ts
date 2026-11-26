import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.interface';

@Component({
  imports: [RouterLink],
  selector: 'app-cart',
  styleUrl: './cart.component.css',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit{
  private readonly cartService = inject(CartService);
  cartDetails = signal<Cart>({} as Cart);

  ngOnInit(): void {
    this.getCardData();
  }

  getCardData():void{
    this.cartService.getLoggedUserCart().subscribe({
      next:(res)=>{
        console.log(res.data);
        this.cartDetails.set(res.data);
      }
    })
  }

  deleteItem(id: string): void {
    this.cartService.removeSpecificCartItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails.set(res.data);
      }
    });
  }

  updateProduct(id:string, count:number):void{
    this.cartService.updateCartProduct(id,count).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails.set(res.data);
      }
    });
  }

  clearCart(): void {
    this.cartService.clearUserCart().subscribe({
      next: (res) => {
        console.log(res);
  
        this.cartDetails.update(cart => ({
          ...cart,
          products: [],
          totalCartPrice: 0
        }));
      }
    });
  }
}
