import { Component ,signal} from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { apiFanPost$Json } from '../../api/functions';
import { CreateFanDto } from '../../api/models/create-fan-dto';
import { ApiConfiguration } from '../../api/api-configuration';
import {form, FormField,required, email, min,max} from '@angular/forms/signals';

@Component({
  selector: 'app-fan-registration',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    FormField,
  ],
  templateUrl: './fan-registration.component.html',
  styleUrl: './fan-registration.component.css',
})
export class FanRegistrationComponent {

  fanModel = signal<CreateFanDto>({
    email: '',
    name: '',
    yearsAsFan: 0,
  });

  fanForm = form(this.fanModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    email(schemaPath.email, {message: 'Enter a valid email address'});
    required(schemaPath.name, {message: 'Name is required'});
    required(schemaPath.yearsAsFan, {message: 'Years as Fan is required'});
    min(schemaPath.yearsAsFan, 0, {message: 'Years as Fan cannot be negative'});
    max(schemaPath.yearsAsFan, 100, {message: 'Years as Fan cannot be greater than 100'});
  });

  successMessage = '';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration,
  ) {}

  onSubmit() {
    if (this.fanForm().invalid()) {
      return;
    }
    const body: CreateFanDto = this.fanForm().value();
    apiFanPost$Json(this.http, this.apiConfig.rootUrl, { body }).subscribe({
      next: (res) => {
        this.successMessage = `Registered (id ${res.body ?? ''})`;
        this.errorMessage = '';
          this.fanForm().reset();
        },
        error: () => {
          this.errorMessage = 'Registration failed';
          this.successMessage = '';
        },
      });
    }

}
