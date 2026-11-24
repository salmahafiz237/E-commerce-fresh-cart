import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../models/brand.interface';
import { BenifitBrandComponent } from '../../../../shared/ui/benifit-brand/benifit-brand.component';

@Component({
  selector: 'app-brands',
  imports: [RouterLink, BenifitBrandComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {

  private readonly brandService = inject(BrandService);
  brands = signal<Brand[]>([]);
  errorMessage = signal<string>('');

  
  ngOnInit(): void {
    this.getBrands();
  }

  getBrands(): void {
    this.brandService.brands().subscribe({
      next: (res) => {
        this.brands.set(res.data);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Something went wrong while loading brands.');
      }
    });
  }
}