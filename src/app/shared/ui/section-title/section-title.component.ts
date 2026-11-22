import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-section-title',
  styleUrl: './section-title.component.css',
  templateUrl: './section-title.component.html',
})
export class SectionTitleComponent {
  title = input.required();
  highlight= input.required();
  
}
