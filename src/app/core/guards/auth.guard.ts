import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: import('@angular/router').CanActivateFn = () => {
  const token = localStorage.getItem('jwt');
  if (token) {
    return true;
  } else {
    inject(Router).navigate(['/login']);
    return false;
  }
};
