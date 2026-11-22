import { Component, input } from '@angular/core';
import { Category } from '../../../core/models/category.interface';

@Component({
  imports: [],
  selector: 'app-card-category',
  styleUrl: './card-category.component.css',
  templateUrl: './card-category.component.html',
})
export class CardCategoryComponent {
  category = input.required<Category>();
}
