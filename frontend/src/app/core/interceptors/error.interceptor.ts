import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// DRY: manejo centralizado de errores HTTP
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(err => {
      const message = err.error?.message ?? 'Error de conexión con el servidor';
      console.error(`[HTTP ${err.status}]`, message);
      return throwError(() => new Error(message));
    })
  );
};
