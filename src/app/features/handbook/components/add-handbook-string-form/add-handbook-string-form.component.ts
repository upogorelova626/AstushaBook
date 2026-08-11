import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import {BarContext} from '../../../handbooks/components/host-drawer/base-bar.service';
import {injectContext} from '@taiga-ui/polymorpheus';
import {
    Handbook,
    HandbookColumnType,
    HandbookRow
} from '../../../../shared/interfaces';
import {
    ReactiveFormsModule,
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiCalendar,
    TuiCheckbox,
    TuiDropdown,
    TuiError,
    TuiInput,
    TuiNotificationService,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiInputDate} from '@taiga-ui/kit';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {catchError, EMPTY, finalize, tap} from 'rxjs';
import {SearchUsersComponent} from '../../../handbooks/components/create-handbook-components/search-users/search-users.component';

@Component({
    selector: 'app-add-handbook-string-form',
    imports: [
        ReactiveFormsModule,
        TuiTextfield,
        TuiInput,
        TuiButton,
        TuiCheckbox,
        TuiCalendar,
        TuiInputDate,
        TuiDropdown,
        TuiError,
        SearchUsersComponent
    ],
    templateUrl: './add-handbook-string-form.component.html',
    styleUrl: './add-handbook-string-form.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useFactory: () => ({
                required: 'Поле обязательно для заполнения',

                maxlength: ({requiredLength}: {requiredLength: number}) =>
                    `Введите не более ${requiredLength} символов`
            })
        }
    ]
})
export class AddHandbookStringFormComponent {
    protected readonly context =
        injectContext<
            BarContext<{handbook: Handbook; editRow?: HandbookRow}, HandbookRow>
        >();

    private readonly handbookService = inject(HandbookService);
    private readonly alerts = inject(TuiNotificationService);

    private readonly value = signal({});

    protected readonly handbook = this.context.handbook;
    protected readonly editRow = this.context.editRow;

    protected readonly isEditing = signal(false);
    protected readonly isAdding = signal(false);
    protected readonly isSaving = signal(false);

    protected readonly isRowAddingOrEditing = signal(true);

    protected readonly HandbookColumnType = HandbookColumnType;

    protected readonly stringForm = new FormGroup({});

    constructor() {
        if (!this.editRow) {
            this.isEditing.set(false);
            this.isAdding.set(true);
        } else {
            this.isEditing.set(true);
            this.isAdding.set(false);
        }

        for (const column of this.handbook.columns) {
            const value =
                column.type === HandbookColumnType.Boolean
                    ? (this.editRow?.values[column.id] ?? false)
                    : column.type === HandbookColumnType.User
                      ? (this.editRow?.values[column.id] ?? null)
                      : (this.editRow?.values[column.id] ?? '');

            this.stringForm.addControl(
                column.id,
                new FormControl(value, [
                    ...(column.required &&
                    column.type !== HandbookColumnType.Boolean
                        ? [Validators.required]
                        : []),
                    ...(column.type === HandbookColumnType.Text
                        ? [Validators.maxLength(1000)]
                        : [])
                ])
            );
        }
    }

    protected save() {
        this.stringForm.markAllAsTouched();
        if (this.stringForm.invalid) {
            return;
        }

        this.isSaving.set(true);

        const handbookId = this.handbook.id;
        const payload = {values: this.stringForm.getRawValue()};

        this.handbookService
            .addRow(handbookId, payload)
            .pipe(
                tap(() =>
                    this.alerts
                        .open('Строка успешно добавлена', {
                            label: 'Готово',
                            appearance: 'positive'
                        })
                        .subscribe()
                ),
                catchError(() => {
                    this.alerts
                        .open(
                            'Не удалось добавить строку. Попробуйте еще раз',
                            {label: 'Ошибка', appearance: 'negative'}
                        )
                        .subscribe();
                    return EMPTY;
                }),
                finalize(() => {
                    this.isSaving.set(false);
                })
            )
            .subscribe(row => this.context.complete(row));
    }

    protected edit() {
        const rowId = this.editRow?.id;
        if (!rowId) {
            return;
        }

        this.stringForm.markAllAsTouched();
        if (this.stringForm.invalid) {
            return;
        }

        this.isSaving.set(true);

        const handbookId = this.handbook.id;
        const formValues = this.stringForm.getRawValue();

        const payload = {
            rows: [
                {
                    id: rowId,
                    values: formValues
                }
            ]
        };

        this.handbookService
            .editHandbookRows(handbookId, payload)
            .pipe(
                tap(() =>
                    this.alerts
                        .open('Строка успешно обновлена', {
                            label: 'Готово',
                            appearance: 'positive'
                        })
                        .subscribe()
                ),
                catchError(() => {
                    this.alerts
                        .open(
                            'Не удалось обновить строку. Попробуйте еще раз',
                            {label: 'Ошибка', appearance: 'negative'}
                        )
                        .subscribe();
                    return EMPTY;
                }),
                finalize(() => {
                    this.isSaving.set(false);
                })
            )
            .subscribe(([row]) => {
                if (row) {
                    this.context.complete(row);
                }

                console.log(row);
            });
    }
}
