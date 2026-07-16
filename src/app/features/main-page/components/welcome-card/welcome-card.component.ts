import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiTextfield, TuiInputDirective, TuiButton} from '@taiga-ui/core';

@Component({
    selector: 'app-welcome-card',
    imports: [TuiTextfield, TuiInputDirective, TuiButton],
    templateUrl: './welcome-card.component.html',
    styleUrl: './welcome-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeCardComponent {}
