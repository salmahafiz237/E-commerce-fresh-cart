import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AccountService } from '../../services/account.service';
import { Address } from '../../models/account.interface';

const passwordsMatch: ValidatorFn = (group: AbstractControl) => {
  const password = group.get('password')?.value;
  const rePassword = group.get('rePassword')?.value;
  return password === rePassword ? null : { mismatch: true };
};

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-account',
  styleUrl: './account.component.css',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly accountService = inject(AccountService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  activeTab = signal<'addresses' | 'settings'>('addresses');

  // user info (read-only part)
  userId = signal<string | null>(null);
  role = signal('user');

  // addresses
  addresses = signal<Address[]>([]);
  loadingAddresses = signal(true);
  deletingId = signal<string | null>(null);
  showModal = signal(false);
  savingAddress = signal(false);

  // settings
  savingProfile = signal(false);
  savingPassword = signal(false);
  showCurrent = signal(false);
  showNew = signal(false);
  showConfirm = signal(false);

  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  });

  addressForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    details: ['', [Validators.required, Validators.minLength(10)]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
  });

  passwordForm = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/)]],
      rePassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch }
  );

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.userId.set(this.authService.getUserId());

    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this.role.set(user.role ?? 'user');
        this.profileForm.patchValue({
          name: user.name ?? '',
          email: user.email ?? '',
          phone: user.phone ?? '',
        });
      } catch {}
    }

    this.loadAddresses();
  }

  // ---------- Addresses ----------
  loadAddresses(): void {
    this.accountService.getAddresses().subscribe({
      next: (res) => {
        this.addresses.set(res.data ?? []);
        this.loadingAddresses.set(false);
      },
      error: () => this.loadingAddresses.set(false),
    });
  }

  openModal(): void {
    this.addressForm.reset();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  submitAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.savingAddress.set(true);
    this.accountService.addAddress(this.addressForm.getRawValue()).subscribe({
      next: (res) => {
        // the API returns the updated list of addresses
        if (Array.isArray(res.data)) this.addresses.set(res.data);
        else this.loadAddresses();
        this.savingAddress.set(false);
        this.showModal.set(false);
        this.toast.success('Address added successfully');
      },
      error: () => this.savingAddress.set(false),
    });
  }

  deleteAddress(id: string): void {
    this.deletingId.set(id);
    this.accountService.removeAddress(id).subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) this.addresses.set(res.data);
        else this.addresses.update((list) => list.filter((a) => a._id !== id));
        this.deletingId.set(null);
        this.toast.success('Address removed');
      },
      error: () => this.deletingId.set(null),
    });
  }

  // ---------- Profile ----------
  submitProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.savingProfile.set(true);
    const body = this.profileForm.getRawValue();

    this.accountService.updateProfile(body).subscribe({
      next: (res) => {
        const stored = JSON.parse(localStorage.getItem('user') ?? '{}');
        localStorage.setItem('user', JSON.stringify({ ...stored, ...(res.user ?? {}), phone: body.phone }));
        this.savingProfile.set(false);
        this.toast.success('Profile updated successfully');
      },
      error: () => this.savingProfile.set(false),
    });
  }

  // ---------- Password ----------
  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.savingPassword.set(true);

    this.accountService.changePassword(this.passwordForm.getRawValue()).subscribe({
      next: (res) => {
        // the API returns a fresh token after the password changes
        if (res.token) localStorage.setItem('token', res.token);
        this.passwordForm.reset();
        this.savingPassword.set(false);
        this.toast.success('Password changed successfully');
      },
      error: () => this.savingPassword.set(false),
    });
  }
}