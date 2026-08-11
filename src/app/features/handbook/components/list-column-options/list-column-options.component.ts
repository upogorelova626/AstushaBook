import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiInput, TuiTextfield, TuiButton, TuiError} from '@taiga-ui/core';
import {
    ReactiveFormsModule,
    FormArray,
    FormControl,
    Validators
} from '@angular/forms';

@Component({
    selector: 'app-list-column-options',
    imports: [TuiTextfield, TuiInput, TuiButton, ReactiveFormsModule, TuiError],
    templateUrl: './list-column-options.component.html',
    styleUrl: './list-column-options.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListColumnOptionsComponent {
    readonly options = input.required<FormArray<FormControl<string>>>();

    protected addOption() {
        this.options().push(
            new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.maxLength(100)]
            })
        );
    }

    protected deleteOption(index: number) {
        this.options().removeAt(index);
    }
}
