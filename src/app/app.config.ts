import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideEventPlugins} from '@taiga-ui/event-plugins';
import {provideTaiga} from '@taiga-ui/core';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideTuiEditor} from '@taiga-ui/editor';
import {credentialsIntercepror} from './shared/interceptors/credentials.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideEventPlugins(),
        provideTaiga(),
        provideHttpClient(withInterceptors([credentialsIntercepror])),
        provideTuiEditor()
    ]
};
