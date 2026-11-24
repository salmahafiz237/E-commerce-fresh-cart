import { Component, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { Shop } from '../../../../core/models/shop.interface';
import { ShopService } from '../../../../core/services/shop.service';
import { SectionTitleComponent } from '../../../../shared/ui/section-title/section-title.component';

@Component({
  imports: [CardComponent, SectionTitleComponent],
  selector: 'app-shop',
  styleUrl: './shop.component.css',
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit{
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
