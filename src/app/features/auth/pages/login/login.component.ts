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
  });

  submitForm(): void {
    if (this.loginForm.valid) {
      // send loginform value
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            // navigate home
            // check success
            // save token
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));

            console.log(res);
            this.router.navigate(['/']);
          }
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
