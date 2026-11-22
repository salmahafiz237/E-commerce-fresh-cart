import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { ShopService } from './../../../../core/services/shop.service';
import { Shop } from '../../../../core/models/shop.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-shop-details',
  styleUrl: './shop-details.component.css',
  templateUrl: './shop-details.component.html',
})
export class ShopDetailsComponent implements OnInit{
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly shopService = inject(ShopService);
  product= signal<Shop>({} as Shop);

  ngOnInit(): void {
    this.getId();
  }

  getId():void{
    this.activatedRoute.paramMap.subscribe((params)=>{
      console.log(params.get('id'));
      this.getProductDetails(params.get('id')!);
    })
  }

  getProductDetails(id:string):void{
    this.shopService.getSingleProducts(id).subscribe({
      next:(res)=>{
        console.log(res.data);
        this.product.set(res.data);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
