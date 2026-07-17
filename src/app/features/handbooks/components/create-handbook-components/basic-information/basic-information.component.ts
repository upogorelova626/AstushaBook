import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiInput, TuiLabel, TuiTextfield} from '@taiga-ui/core';

@Component({
    selector: 'app-basic-information',
    imports: [TuiTextfield, TuiInput, TuiLabel],
    templateUrl: './basic-information.component.html',
    styleUrl: './basic-information.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicInformationComponent {}
