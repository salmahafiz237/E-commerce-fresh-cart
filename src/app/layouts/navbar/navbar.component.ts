import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from './../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';

@Component({
  imports: [],
selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit{
  constructor(private FlowbiteService: FlowbiteService) {}
  ngOnInit(): void {
    this.FlowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
}
