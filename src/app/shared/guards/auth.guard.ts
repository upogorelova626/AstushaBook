import {inject} from '@angular/core';
import {CanActivateFn} from '@angular/router';
import {catchError, map, of} from 'rxjs';

import {UserService} from '../../features/auth/services/user.service';

const ASTUSHA_ID_LOGIN_URL = 'http://localhost:4202/auth/login';

export const authGuard: CanActivateFn = (_route, state) => {
    const userService = inject(UserService);

    return userService.getMe().pipe(
        map(() => true),
        catchError(() => {
            const returnUrl = `${window.location.origin}${state.url}`;

            window.location.href = `${ASTUSHA_ID_LOGIN_URL}?returnUrl=${encodeURIComponent(returnUrl)}`;

            return of(false);
        })
    );
};
