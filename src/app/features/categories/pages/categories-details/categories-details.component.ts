import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.interface';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-categories-details',
  styleUrl: './categories-details.component.css',
  templateUrl: './categories-details.component.html',
})
export class CategoriesDetailsComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  category= signal<Category>({} as Category);

  ngOnInit(): void {
    this.getId();
  }

  getId():void{
    this.activatedRoute.paramMap.subscribe((params)=>{
      console.log(params.get('id'));
      this.getAllCategories(params.get('id')!);
    })
  }

  getAllCategories(id:string):void{
    this.categoryService.getSingleCategory(id).subscribe({
      next:(res)=>{
        console.log(res.data);
        this.category.set(res.data);
      }
    })
  }
}
