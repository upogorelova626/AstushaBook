import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
    TuiButton,
    TuiIcon,
    TuiInput,
    TuiTextfield,
    TuiLink
} from '@taiga-ui/core';

@Component({
    selector: 'app-login-form',
    imports: [TuiTextfield, TuiInput, TuiIcon, TuiButton, TuiLink],
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {}
