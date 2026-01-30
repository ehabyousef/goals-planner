import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Auth } from '../../core/services/auth';
import { ILogin } from '../../core/interface/Types';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    MessageModule,
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(
    private _AuthService: Auth,
    private messageService: MessageService,
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
      this.isSubmitting.set(true);
      const formData = this.loginForm.getRawValue();
      this.Login(formData);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  Login(data: ILogin): void {
    this._AuthService.login(data).subscribe({
      next: (res) => {
        if (res.token) {
          this.showToast('success', 'success', 'sign in successed');
          this._AuthService.setToken(res.token);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        const errorMessage = err.message || 'Invalid email or password';
        this.showToast('error', 'Login Failed', errorMessage);
      },
    });
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 1500,
    });
  }
}
