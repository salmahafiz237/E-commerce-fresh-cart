import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent } from '../../../../shared/ui/section-title/section-title.component';
import { ShopService } from '../../../../core/services/shop.service';
import { Shop } from '../../../../core/models/shop.interface';
import { CardComponent } from '../../../../shared/ui/card/card.component';

@Component({
  imports: [SectionTitleComponent, CardComponent],
  selector: 'app-product-section',
  styleUrl: './product-section.component.css',
  templateUrl: './product-section.component.html',
})
export class ProductSectionComponent implements OnInit{
  private readonly shopService = inject(ShopService);
  allProducts= signal<Shop[]>([]);

  ngOnInit(): void {
    this.getAllProductsData();
  }


  getAllProductsData():void{
    this.shopService.getAllProducts().subscribe({
      next:(res)=>{
        console.log(res.data);
        this.allProducts.set(res.data);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
