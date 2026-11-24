import {Component,DestroyRef,inject,OnInit,signal} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Brand } from '../models/brand.interface';
import { Shop } from '../../../../core/models/shop.interface';
import { BrandService } from '../../services/brand.service';
import { ShopService } from '../../../../core/services/shop.service';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BenifitBrandComponent } from '../../../../shared/ui/benifit-brand/benifit-brand.component';

@Component({
  selector: 'app-brand-details',
  imports: [RouterLink,CardComponent,BenifitBrandComponent],
  templateUrl: './brand-details.component.html',
  styleUrl: './brand-details.component.css',
})
export class BrandDetailsComponent implements OnInit {

  private readonly brandService = inject(BrandService);
  private readonly shopService = inject(ShopService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  brand = signal<Brand | null>(null);
  products = signal<Shop[]>([]);
  errorMessage = signal<string>('');
  productsError = signal<string>('');

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
        const brandId = params.get('id');
        if (!brandId) {
          this.errorMessage.set('Brand not found.');
          return;
        }
        this.getBrandDetails(brandId);
        this.getBrandProducts(brandId);
      });
  }

  getBrandDetails(id: string): void {
    this.brandService.brandsDetails(id).subscribe({
      next: (res) => {
        this.brand.set(res.data);
        this.errorMessage.set('');
      },

      error: (err) => {
        console.error(err);
        this.errorMessage.set(
          'Something went wrong while loading brand details.'
        );
      }
    });
  }

  getBrandProducts(brandId: string): void {
    this.shopService.getProductsByBrand(brandId).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.productsError.set('');
      },

      error: (err) => {
        console.error(err);
        this.productsError.set(
          'Something went wrong while loading products.'
        );
      }
    });
  }
}
