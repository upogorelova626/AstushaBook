import {HttpInterceptorFn} from '@angular/common/http';

export const credentialsIntercepror: HttpInterceptorFn = (req, next) => {
    return next(req.clone({withCredentials: true}));
};
