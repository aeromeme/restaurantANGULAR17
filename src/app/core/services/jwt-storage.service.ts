import { Injectable, computed, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class JwtStorageService {
  private readonly TOKEN_KEY = 'jwt';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private tokenSignal = signal<string | null>(this.getTokenFromStorage());

  // opcional: exponer token como computed "solo lectura"
  token = computed(() => this.tokenSignal());

  isAuthenticated = computed(() => !!this.tokenSignal());

  saveToken(token: string): void {
    if (this.isBrowser) sessionStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  removeToken(): void {
    if (this.isBrowser) sessionStorage.removeItem(this.TOKEN_KEY);
    this.tokenSignal.set(null);
  }

  private getTokenFromStorage(): string | null {
    return this.isBrowser ? sessionStorage.getItem(this.TOKEN_KEY) : null;
  }
}