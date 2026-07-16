import {Routes} from '@angular/router';
import {authGuard} from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'astusha',
        pathMatch: 'full'
    },
    {
        path: 'astusha',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./layout/app-layout/app-layout/app-layout.component').then(
                component => component.AppLayoutComponent
            ),
        children: [
            {
                path: '',
                redirectTo: 'main-page',
                pathMatch: 'full'
            },
            {
                path: 'main-page',
                loadComponent: () =>
                    import('./features/main-page/main-page/main-page.component').then(
                        component => component.MainPageComponent
                    )
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'astusha'
    }
];
