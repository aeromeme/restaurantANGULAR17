import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './app/core/interceptors/jwt.interceptor';
import { loggingInterceptor } from './app/core/interceptors/logging.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // <-- This provides ActivatedRoute and other router services
    provideHttpClient(withInterceptors([jwtInterceptor, loggingInterceptor])),
    importProvidersFrom(BrowserAnimationsModule),
    // ...other providers
  ],
}).catch((err) => console.error(err));
