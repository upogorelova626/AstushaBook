import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiInput, TuiTextfield} from '@taiga-ui/core';
import {TuiSwitch} from '@taiga-ui/kit';

@Component({
    selector: 'app-table-structure',
    imports: [
        ReactiveFormsModule,
        TuiTextfield,
        TuiInput,
        TuiButton,
        TuiSwitch
    ],
    templateUrl: './table-structure.component.html',
    styleUrl: './table-structure.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableStructureComponent {
    protected readonly form = new FormArray([
        new FormGroup({}),
        new FormGroup({})
    ]);
}
