import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiInput, TuiTextfield} from '@taiga-ui/core';

@Component({
    selector: 'app-handbooks-toolbar',
    imports: [TuiTextfield, TuiInput],
    templateUrl: './handbooks-toolbar.component.html',
    styleUrl: './handbooks-toolbar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbooksToolbarComponent {}
