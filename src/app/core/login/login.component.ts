import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../api/services/auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, // <-- Add this line
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput placeholder="Username" formControlName="username" />
      </mat-form-field>
      <mat-form-field>
        <input
          matInput
          type="password"
          placeholder="Password"
          formControlName="password"
        />
      </mat-form-field>
      <button
        mat-raised-button
        color="primary"
        type="submit"
        [disabled]="loginForm.invalid"
      >
        Login
      </button>
      <div *ngIf="error" style="color:red; margin-top:8px;">{{ error }}</div>
    </form>
  `,
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('jwt')) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth
        .apiAuthLoginPost$Json({ body: this.loginForm.value }) // Use the $Json method
        .subscribe({
          next: (res) => {
            localStorage.setItem('jwt', res.token ?? ''); // Use res.token if response is { token: string }
            this.router.navigate(['/']);
          },
          error: () => {
            this.error = 'Invalid credentials';
          },
        });
    }
  }
}
