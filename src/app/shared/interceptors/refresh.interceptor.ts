// import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
// import {inject} from '@angular/core';
// import {catchError, EMPTY, switchMap, throwError} from 'rxjs';

// import {AuthService} from '../services/auth.service';

// const ASTUSHA_ID_LOGIN_URL = 'http://localhost:4202/auth/login';

// export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
//     const authService = inject(AuthService);

//     if (req.url.includes('/auth/refresh')) {
//         return next(req);
//     }

//     return next(req).pipe(
//         catchError((error: HttpErrorResponse) => {
//             if (error.status !== 401) {
//                 return throwError(() => error);
//             }

//             return authService.refresh().pipe(
//                 switchMap(() => next(req)),

//                 catchError((refreshError: HttpErrorResponse) => {
//                     if (refreshError.status === 401) {
//                         const returnUrl = window.location.href;

//                         window.location.href = `${ASTUSHA_ID_LOGIN_URL}?returnUrl=${encodeURIComponent(returnUrl)}`;

//                         return EMPTY;
//                     }

//                     return throwError(() => refreshError);
//                 })
//             );
//         })
//     );
// };
