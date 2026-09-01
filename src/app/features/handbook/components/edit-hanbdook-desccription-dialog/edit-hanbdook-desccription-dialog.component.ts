import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    type TuiDialogContext,
    TuiError,
    TuiNotificationService,
    TuiTextfield
} from '@taiga-ui/core';
import {Handbook} from '../../../../shared/interfaces';
import {ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {catchError, EMPTY, tap} from 'rxjs';
import {TuiTextarea} from '@taiga-ui/kit';
import {HandbookInfoService} from '../../services/handbook-info.service';

@Component({
    selector: 'app-edit-hanbdook-desccription-dialog',
    imports: [
        TuiButton,
        TuiTextarea,
        TuiTextfield,
        ReactiveFormsModule,
        TuiError
    ],
    templateUrl: './edit-hanbdook-desccription-dialog.component.html',
    styleUrl: './edit-hanbdook-desccription-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useFactory: () => ({
                maxlength: ({requiredLength}: {requiredLength: number}) =>
                    `Введите не более ${requiredLength} символов`
            })
        }
    ]
})
export class EditHanbdookDesccriptionDialogComponent {
    private readonly handbookService = inject(HandbookService);
    private readonly handbookInfoService = inject(HandbookInfoService);
    private readonly alerts = inject(TuiNotificationService);

    protected readonly context =
        injectContext<TuiDialogContext<void, Handbook>>();
    protected handbook = this.context.data;

    protected readonly control = new FormControl(
        this.handbook.description || '',
        {
            nonNullable: true,
            validators: [Validators.maxLength(1000)]
        }
    );

    protected editHandbookDescription() {
        this.control.markAsTouched();
        if (this.control.invalid) {
            return;
        }

        const initialDescription = this.handbook.description.trim();

        if (initialDescription === this.control.getRawValue().trim()) {
            this.context.completeWith();
            return;
        }

        const handbookId = this.handbook.id;
        const payload = {description: this.control.getRawValue()};

        this.handbookService
            .editHandbookDescription(handbookId, payload)
            .pipe(
                tap(() => {
                    this.alerts
                        .open('Описание успешно обновлено', {
                            label: 'Готово',
                            appearance: 'positive'
                        })
                        .subscribe();
                    this.handbookInfoService.getHandbook(this.handbook.id);
                }),
                catchError(() => {
                    this.alerts
                        .open('Не удалось обновить описание', {
                            label: 'Ошибка',
                            appearance: 'negative'
                        })
                        .subscribe();
                    return EMPTY;
                })
            )
            .subscribe(() => {
                this.context.completeWith();
            });
    }
}
