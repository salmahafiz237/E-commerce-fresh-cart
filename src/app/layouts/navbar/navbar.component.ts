import { Component, computed, inject, OnInit } from '@angular/core';
import { FlowbiteService } from './../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  imports: [RouterLink],
selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit{
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLogged = computed(()=> this.authService.isLogged())

  constructor(private FlowbiteService: FlowbiteService) {}
  ngOnInit(): void {
    this.FlowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

    
  signOut():void{
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.authService.isLogged.set(false);
  }
}
