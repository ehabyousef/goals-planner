import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { Auth } from '../../core/services/auth';
import { IRegister } from '../../core/interface/Types';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  constructor(
    private _AuthService: Auth,
    private router: Router,
  ) {}

  RegisterForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get email() {
    return this.RegisterForm.controls.email;
  }
  get emaiuserNamel() {
    return this.RegisterForm.controls.userName;
  }
  get password() {
    return this.RegisterForm.controls.password;
  }
  isSubmitting = signal(false);

  shouldShowError(controlName: 'email' | 'password' | 'userName'): boolean {
    const control = this.RegisterForm.controls[controlName];
    return !!(control.invalid && control.touched);
  }

  getErrorMessage(controlName: 'email' | 'password' | 'userName'): string {
    const control = this.RegisterForm.controls[controlName];
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
    if (this.RegisterForm.valid) {
      this.isSubmitting.set(true);
      const formData = this.RegisterForm.getRawValue();
      this.Register(formData);
    } else {
      this.RegisterForm.markAllAsTouched();
    }
  }

  Register(data: IRegister): void {
    this._AuthService.register(data).subscribe({
      next: (res) => {
        if (res.token) {
          toast.success('Registration successful');
          this._AuthService.setToken(res.token);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Register error:', err);
        const errorMessage = err.message || 'Registration failed';
        toast.error('Registration Failed', { description: errorMessage });
      },
    });
  }
}
