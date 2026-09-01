import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {TuiDay} from '@taiga-ui/cdk';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiCalendar,
    TuiDropdown,
    TuiError,
    TuiGroup,
    TuiInput,
    TuiNotificationService,
    TuiRadio,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiEditor} from '@taiga-ui/editor';
import {
    TuiBlock,
    TuiChevron,
    TuiComboBox,
    TuiDataListWrapper,
    TuiInputDate
} from '@taiga-ui/kit';
import {injectContext} from '@taiga-ui/polymorpheus';
import {catchError, EMPTY, finalize, tap} from 'rxjs';

import {
    Handbook,
    HandbookCellValue,
    HandbookColumnResponse,
    HandbookColumnType,
    HandbookRow
} from '../../../../shared/interfaces';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {SearchUsersComponent} from '../../../handbooks/components/create-handbook-components/search-users/search-users.component';
import {BarContext} from '../../../handbooks/components/host-drawer/base-bar.service';
import {HandbookInfoService} from '../../services/handbook-info.service';

@Component({
    selector: 'app-add-handbook-string-form',
    imports: [
        ReactiveFormsModule,
        TuiTextfield,
        TuiInput,
        TuiButton,
        TuiCalendar,
        TuiInputDate,
        TuiDropdown,
        TuiError,
        SearchUsersComponent,
        TuiComboBox,
        TuiDataListWrapper,
        TuiChevron,
        TuiEditor,
        TuiBlock,
        TuiGroup,
        TuiRadio
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
    private readonly handbookService = inject(HandbookService);
    private readonly handbookInfoService = inject(HandbookInfoService);
    private readonly alerts = inject(TuiNotificationService);

    protected readonly context =
        injectContext<
            BarContext<{handbook: Handbook; editRow?: HandbookRow}, HandbookRow>
        >();

    protected readonly handbook = this.context.handbook;
    protected readonly editRow = this.context.editRow;

    protected readonly isEditing = signal(false);
    protected readonly isAdding = signal(false);
    protected readonly isSaving = signal(false);

    protected readonly isRowAddingOrEditing = signal(true);

    protected readonly HandbookColumnType = HandbookColumnType;

    protected readonly stringForm = new FormGroup({});

    constructor() {
        if (this.editRow) {
            this.isEditing.set(true);
        } else {
            this.isAdding.set(true);
        }

        for (const column of this.handbook.columns) {
            const editValue = this.editRow?.values[column.id];

            const value =
                column.type === HandbookColumnType.Boolean
                    ? (editValue ?? false)
                    : column.type === HandbookColumnType.User
                      ? (editValue ?? null)
                      : column.type === HandbookColumnType.Date
                        ? (this.toTuiDay(editValue) ?? TuiDay.currentLocal())
                        : column.type === HandbookColumnType.Reference
                          ? this.getReferenceRowId(editValue)
                          : (editValue ?? '');

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

        const payload = {
            values: this.stringForm.getRawValue()
        };

        this.handbookService
            .addRow(handbookId, payload)
            .pipe(
                tap(() => {
                    this.handbookInfoService.getHandbookRows(handbookId);

                    this.alerts
                        .open('Строка успешно добавлена', {
                            label: 'Готово',
                            appearance: 'positive'
                        })
                        .subscribe();
                }),

                catchError(() => {
                    this.alerts
                        .open(
                            'Не удалось добавить строку. Попробуйте еще раз',
                            {
                                label: 'Ошибка',
                                appearance: 'negative'
                            }
                        )
                        .subscribe();

                    return EMPTY;
                }),

                finalize(() => {
                    this.isSaving.set(false);
                })
            )
            .subscribe(() => {
                this.context.complete();
            });
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
                tap(() => {
                    this.handbookInfoService.getHandbookRows(handbookId);

                    this.alerts
                        .open('Строка успешно обновлена', {
                            label: 'Готово',
                            appearance: 'positive'
                        })
                        .subscribe();
                }),

                catchError(() => {
                    this.alerts
                        .open(
                            'Не удалось обновить строку. Попробуйте еще раз',
                            {
                                label: 'Ошибка',
                                appearance: 'negative'
                            }
                        )
                        .subscribe();

                    return EMPTY;
                }),

                finalize(() => {
                    this.isSaving.set(false);
                })
            )
            .subscribe(() => {
                this.context.complete();
            });
    }

    protected getReferenceIds(column: HandbookColumnResponse): string[] {
        return column.reference?.values.map(item => item.rowId) ?? [];
    }

    protected getReferenceValue(
        column: HandbookColumnResponse,
        rowId: string
    ): string {
        const item = column.reference?.values.find(
            value => value.rowId === rowId
        );

        return item ? String(item.value) : '';
    }

    protected stringifyReference(
        column: HandbookColumnResponse
    ): (rowId: string) => string {
        return (rowId: string) => this.getReferenceValue(column, rowId);
    }

    private getReferenceRowId(
        value: HandbookCellValue | undefined
    ): string | null {
        if (typeof value === 'string') {
            return value;
        }

        if (
            typeof value !== 'object' ||
            value === null ||
            !('rowId' in value) ||
            typeof value.rowId !== 'string'
        ) {
            return null;
        }

        return value.rowId;
    }

    private toTuiDay(value: HandbookCellValue | undefined): TuiDay | null {
        if (typeof value !== 'string') {
            return null;
        }

        const nativeDate = new Date(value.trim());

        return TuiDay.fromLocalNativeDate(nativeDate);
    }
}
