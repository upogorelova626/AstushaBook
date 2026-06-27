import {Routes} from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadComponent: () =>
            import('./layout/auth-layout/auth-layout/auth-layout.component').then(
                component => component.AuthLayoutComponent
            ),
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./features/auth/pages/login-page/login-page.component').then(
                        component => component.LoginPageComponent
                    )
            },
            {
                path: 'create-account',
                loadComponent: () =>
                    import('./features/auth/pages/create-account/create-account.component').then(
                        component => component.CreateAccountComponent
                    )
            },
            {
                path: 'reset-password',
                loadComponent: () =>
                    import('./features/auth/pages/reset-password/reset-password.component').then(
                        component => component.ResetPasswordComponent
                    )
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];
