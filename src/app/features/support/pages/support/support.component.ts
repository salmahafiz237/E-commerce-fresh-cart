import { Component } from '@angular/core';
import { BenifitBrandComponent } from '../../../../shared/ui/benifit-brand/benifit-brand.component';
import { RouterLink } from '@angular/router';

@Component({
  imports: [BenifitBrandComponent,RouterLink],
  selector: 'app-support',
  styleUrl: './support.component.css',
  templateUrl: './support.component.html',
})
export class SupportComponent {}
