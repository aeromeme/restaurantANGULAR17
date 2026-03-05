import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtStorageService } from '../services/jwt-storage.service';

export const authGuard: import('@angular/router').CanActivateFn = () => {
  const jwtStorage = inject(JwtStorageService);
  const router = inject(Router);

  if (jwtStorage.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
