import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.interface';
import { SubCategory } from '../../../../core/models/subcategory.interface';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-categories-details',
  styleUrl: './categories-details.component.css',
  templateUrl: './categories-details.component.html',
})
export class CategoriesDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);

  category = signal<Category>({} as Category);
  subCategories = signal<SubCategory[]>([]);
  loadingSubCategories = signal(true);

  ngOnInit(): void {
    this.getId();
  }

  getId(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return; // the plain /categories route has no id
      this.getCategory(id);
      this.getSubCategories(id);
    });
  }

  getCategory(id: string): void {
    this.categoryService.getSingleCategory(id).subscribe({
      next: (res) => this.category.set(res.data),
    });
  }

  getSubCategories(id: string): void {
    this.loadingSubCategories.set(true);
    this.categoryService.getSubCategoriesOnCategory(id).subscribe({
      next: (res) => {
        this.subCategories.set(res.data ?? []);
        this.loadingSubCategories.set(false);
      },
      error: () => this.loadingSubCategories.set(false),
    });
  }
}