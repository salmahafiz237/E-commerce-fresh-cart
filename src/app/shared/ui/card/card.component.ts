import { Component, inject, input } from '@angular/core';
import { Shop } from '../../../core/models/shop.interface';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../features/cart/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-card',
  styleUrl: './card.component.css',
  templateUrl: './card.component.html',
})
export class CardComponent {
  product = input.required<Shop>();
  
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  addProduct(id:string):void{
    if(localStorage.getItem('token')){
      this.cartService.addProductCart(id).subscribe({
        next:(res)=>{
          console.log(res);
          if(res.status === 'success'){
            this.toastService.success(res.message, 'FreshCart');
          }
        }
      })
    }else{
      this.router.navigate(['/login']);
    }
  }
}
