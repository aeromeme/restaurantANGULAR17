import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  console.log('HTTP Request:', req.method, req.urlWithParams, req);
  return next(req).pipe(
    tap({
      next: (event) => {
        // Optionally log responses here
      },
      error: (error) => {
        console.error('HTTP Error:', error);
      },
    })
  );
};
