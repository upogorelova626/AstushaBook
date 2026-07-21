import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {
    TUI_VALIDATION_ERRORS,
    TuiError,
    TuiInput,
    TuiLabel,
    TuiTextfield,
    TuiTextfieldMultiComponent
} from '@taiga-ui/core';
import {CreateHandbookFormService} from '../../../services/create-handbook-form.service';
import {TuiInputChip} from '@taiga-ui/kit';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-basic-information',
    imports: [
        TuiTextfield,
        TuiInput,
        TuiLabel,
        TuiError,
        TuiInputChip,
        TuiTextfieldMultiComponent,
        ReactiveFormsModule
    ],
    templateUrl: './basic-information.component.html',
    styleUrl: './basic-information.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useFactory: () => ({
                required: 'Поле обязательно для заполнения',

                minlength: ({requiredLength}: {requiredLength: number}) =>
                    `Введите минимум ${requiredLength} символа`,

                maxlength: ({requiredLength}: {requiredLength: number}) =>
                    `Введите не более ${requiredLength} символов`,

                pattern:
                    'Системное имя должно начинаться с буквы и содержать только латинские буквы в нижнем регистре, цифры и символ "_"'
            })
        }
    ]
})
export class BasicInformationComponent {
    private readonly createHandbookFormService = inject(
        CreateHandbookFormService
    );

    private readonly destroyRef = inject(DestroyRef);

    protected readonly values = this.createHandbookFormService.values;

    constructor() {
        this.basicInfoForm.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))

            .subscribe(() => {
                this.createHandbookFormService.update(
                    this.basicInfoForm.getRawValue()
                );
            });
    }

    protected readonly basicInfoForm = new FormGroup({
        name: new FormControl(this.values().name ?? '', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ]
        }),
        description: new FormControl(this.values().description ?? '', {
            nonNullable: true,
            validators: [Validators.maxLength(1000)]
        }),
        systemName: new FormControl(this.values().systemName ?? '', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.pattern(/^[a-z][a-z0-9_]*$/)
            ]
        }),
        tags: new FormControl(this.values().tags ?? [], {
            nonNullable: true,
            validators: []
        })
    });
}
