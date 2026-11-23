import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['',[Validators.required,Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/)]],
  })


  submitForm(): void {
    if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return;
    }

    console.log(this.loginForm.value);

    this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
            console.log(res.user);

            if (res.message === 'success') {
                this.router.navigate(['/']);
            }
        }
    });
}
}
