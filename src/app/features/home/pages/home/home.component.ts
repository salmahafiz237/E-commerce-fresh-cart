import { Component } from '@angular/core';
import { CategorySectionComponent } from '../../components/category-section/category-section.component';
import { ProductSectionComponent } from '../../components/product-section/product-section.component';
import { SliderComponent } from '../../components/slider/slider.component';

@Component({
  imports: [CategorySectionComponent, ProductSectionComponent, SliderComponent],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent {}
