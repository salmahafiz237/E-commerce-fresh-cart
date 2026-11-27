import { Component, inject, OnInit, signal } from '@angular/core';
import { BenifitBrandComponent } from '../../../../shared/ui/benifit-brand/benifit-brand.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cart } from '../../../cart/models/cart.interface';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  imports: [BenifitBrandComponent, RouterLink, ReactiveFormsModule,DecimalPipe],
  selector: 'app-check-out',
  styleUrl: './check-out.component.css',
  templateUrl: './check-out.component.html',
})
export class CheckOutComponent implements OnInit{
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);


  flag = signal('cash');
  cartId: string | null = null;
  cartDetails = signal<Cart>({} as Cart);

  ngOnInit(): void {
    this.cartId = this.activatedRoute.snapshot.paramMap.get('id');
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => this.cartDetails.set(res.data),
    });
  }

  checkOutForm = this.formBuilder.group({
    shippingAddress: this.formBuilder.group({
      details: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: ['', [Validators.required, Validators.minLength(2)]]
    })
  })

  
  submitForm(): void {
    if (this.checkOutForm.invalid) {
      this.checkOutForm.markAllAsTouched();
      return;
    }
    if (!this.cartId) return;
  
    const body = this.checkOutForm.getRawValue();
  
    if (this.flag() === 'cash') {
      this.cartService.createCashOrder(this.cartId, body).subscribe({
        next: () => {
          this.cartService.cartCount.set(0);
          this.router.navigate(['/order']);
        },
      });
    } else {
      this.cartService.createCheckOut(this.cartId, body).subscribe({
        next: (res) => window.open(res.session.url, '_self'),
      });
    }
  }
}
