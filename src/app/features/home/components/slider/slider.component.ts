import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { register } from 'swiper/element';

@Component({
  imports: [],
  selector: 'app-slider',
  styleUrl: './slider.component.css',
  templateUrl: './slider.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderComponent implements OnInit{
  ngOnInit(): void {
    register();
  }

}
