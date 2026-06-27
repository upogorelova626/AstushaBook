import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LoginFormComponent} from '../../components/login-page-components/login-form/login-form.component';

@Component({
    selector: 'app-login-page',
    imports: [LoginFormComponent],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {}
