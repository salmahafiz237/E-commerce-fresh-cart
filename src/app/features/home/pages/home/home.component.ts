import { Component } from '@angular/core';
import { CategorySectionComponent } from '../../components/category-section/category-section.component';
import { ProductSectionComponent } from '../../components/product-section/product-section.component';
import { SliderComponent } from '../../components/slider/slider.component';
import { RouterLink } from '@angular/router';
import { BenifitBrandComponent } from '../../../../shared/ui/benifit-brand/benifit-brand.component';

@Component({
  imports: [CategorySectionComponent, ProductSectionComponent, SliderComponent, RouterLink, BenifitBrandComponent],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent {}
