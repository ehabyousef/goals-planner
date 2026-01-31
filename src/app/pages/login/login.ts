import { toast } from 'ngx-sonner';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';
import { ILogin } from '../../core/interface/Types';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    HlmInputImports,
    HlmButtonImports,
    HlmCheckboxImports,
    HlmLabelImports,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(
    private _AuthService: Auth,
    private router: Router,
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get email() {
    return this.loginForm.controls.email;
  }
  get password() {
    return this.loginForm.controls.password;
  }
  isSubmitting = signal(false);

  shouldShowError(controlName: 'email' | 'password'): boolean {
    const control = this.loginForm.controls[controlName];
    return !!(control.invalid && control.touched);
  }

  getErrorMessage(controlName: 'email' | 'password'): string {
    const control = this.loginForm.controls[controlName];
    if (control.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    if (control.hasError('maxlength')) {
      const max = control.getError('maxlength').requiredLength;
      return `maximum ${max} character required`;
    }
    return '';
  }

  onSignIn() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.getRawValue();
      this.Login(formData);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  Login(data: ILogin): void {
    this.isSubmitting.set(true);
    this._AuthService.login(data).subscribe({
      next: (res) => {
        if (res.token) {
          toast.success('Sign in successful');
          this._AuthService.setToken(res.token);
          this.isSubmitting.set(false);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Login error:', err);
        const errorMessage = err.message || 'Invalid email or password';
        toast.error('Login Failed', { description: errorMessage });
      },
    });
  }
}
