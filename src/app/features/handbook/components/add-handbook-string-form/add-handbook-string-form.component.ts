import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {BarContext} from '../../../handbooks/components/host-drawer/base-bar.service';
import {injectContext} from '@taiga-ui/polymorpheus';
import {Handbook, HandbookColumnType} from '../../../../shared/interfaces';
import {
    ReactiveFormsModule,
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';
import {
    TuiButton,
    TuiCalendar,
    TuiCheckbox,
    TuiDropdown,
    TuiInput,
    TuiNotificationService,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiInputDate} from '@taiga-ui/kit';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {catchError, EMPTY, tap} from 'rxjs';

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
        TuiDropdown
    ],
    templateUrl: './add-handbook-string-form.component.html',
    styleUrl: './add-handbook-string-form.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddHandbookStringFormComponent {
    protected readonly context =
        injectContext<BarContext<{handbook: Handbook}, object>>();

    private readonly handbookService = inject(HandbookService);
    private readonly alerts = inject(TuiNotificationService);

    protected readonly handbook = this.context.handbook;

    protected readonly HandbookColumnType = HandbookColumnType;

    protected readonly stringForm = new FormGroup({});

    constructor() {
        for (const column of this.handbook.columns) {
            this.stringForm.addControl(
                column.id,
                new FormControl(
                    this.getInitialValue(column.type),
                    column.required ? Validators.required : null
                )
            );
        }
    }

    private getInitialValue(type: HandbookColumnType) {
        if (type === HandbookColumnType.Text) {
            return 'Астюша';
        }
        if (type === HandbookColumnType.Number) {
            return 22;
        }

        if (type === HandbookColumnType.Boolean) {
            return false;
        } else return '29.12.2003';
    }

    protected save() {
        if (this.stringForm.invalid) {
            this.stringForm.markAllAsTouched();
            return;
        }

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
                })
            )
            .subscribe(row => this.context.complete(row));
    }
}
