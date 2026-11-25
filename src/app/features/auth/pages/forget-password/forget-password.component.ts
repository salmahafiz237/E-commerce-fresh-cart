import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-forget-password',
  styleUrl: './forget-password.component.css',
  templateUrl: './forget-password.component.html',
})
export class ForgetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  isResending = signal(false);
  step = signal(1);

  email = new FormControl('', [Validators.required,Validators.email]);
  code = new FormControl('', [Validators.required,Validators.minLength(6),Validators.maxLength(6)]);
  newPassword = new FormControl('', [Validators.required,Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/)]);

  submitEmail(e: Event): void {
    e.preventDefault();

    if (this.email.valid) {
      const data = {
        email: this.email.value
      };

      this.authService.forgetPassword(data).subscribe({
        next: (res) => {
          console.log(res);

          if (res.statusMsg === 'success') {
            this.step.set(2);
          }
        }
      });
    }
  }

  submitCode(e: Event): void {
    e.preventDefault();

    if (this.code.valid) {
      const data = {
        resetCode: this.code.value
      };

      this.authService.verifyResetCode(data).subscribe({
        next: (res) => {
          console.log(res);

          if (res.status === 'Success') {
            this.step.set(3);
          }
        }
      });
    }
  }

  submitPassword(e: Event): void {
    e.preventDefault();
  
    if (this.newPassword.valid) {
      const data = {
        email: this.email.value,
        newPassword: this.newPassword.value
      };
  
      this.authService.resetPassword(data).subscribe({
        next: (res) => {
          console.log('Response:', res);
  
          if (res.token) {
            this.router.navigateByUrl('/login').then((success) => {
              console.log('Navigation:', success);
            });
          }
        }
      });
    }
  }

  changeEmail(): void {
    this.step.set(1);
    this.code.reset();
  }
  
  resendCode(): void {
    if (this.email.invalid || !this.email.value) {
      this.toastService.error('Please enter a valid email address');
      return;
    }
  
    this.isResending.set(true);
    this.authService.resendResetCode({
      email: this.email.value
    }).pipe(finalize(() => this.isResending.set(false))).subscribe({
      next: (res) => {
        console.log('Resend Response:', res);
  
        if (res.statusMsg === 'success') {
          this.toastService.success(
            'A new verification code has been sent to your email'
          );
          this.code.reset();
        } else {
          this.toastService.error(
            res.message || 'Failed to resend verification code'
          );
        }
      },
      error: (err) => {
        console.log(err);
  
        this.toastService.error(
          err.error?.message || 'Something went wrong. Please try again'
        );
      }
    });
  }
  
}
