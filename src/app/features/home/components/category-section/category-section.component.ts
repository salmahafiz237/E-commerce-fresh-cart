import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent } from '../../../../shared/ui/section-title/section-title.component';
import { CardCategoryComponent } from '../../../../shared/ui/card-category/card-category.component';
import { Category } from '../../../../core/models/category.interface';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  imports: [SectionTitleComponent,CardCategoryComponent],
  selector: 'app-category-section',
  styleUrl: './category-section.component.css',
  templateUrl: './category-section.component.html',
})
export class CategorySectionComponent implements OnInit{
  private readonly categoryService = inject(CategoryService);
  allCategory= signal<Category[]>([]);

  ngOnInit(): void {
    this.getAllCategoryData();
  }


  getAllCategoryData():void{
    this.categoryService.getAllCategories().subscribe({
      next:(res)=>{
        console.log(res.data);
        this.allCategory.set(res.data);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
