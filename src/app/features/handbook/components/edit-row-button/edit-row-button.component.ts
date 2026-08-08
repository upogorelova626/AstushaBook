import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output
} from '@angular/core';
import {TuiButton, TuiHint, TuiNotificationService} from '@taiga-ui/core';
import {Handbook, HandbookRow} from '../../../../shared/interfaces';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {AddHandbookStringFormComponent} from '../add-handbook-string-form/add-handbook-string-form.component';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {catchError, EMPTY, tap} from 'rxjs';

@Component({
    selector: 'app-edit-row-button',
    imports: [TuiButton, TuiHint],
    templateUrl: './edit-row-button.component.html',
    styleUrl: './edit-row-button.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRowButtonComponent {
    readonly handbook = input<Handbook | null>(null);
    readonly row = input<HandbookRow>();

    readonly updatedRow = output<HandbookRow>();
    readonly deletedRowId = output<string>();
    readonly clonedRows = output<HandbookRow[]>();

    private readonly sidebarService = inject(SideBarService);
    private readonly handbookService = inject(HandbookService);
    private readonly alerts = inject(TuiNotificationService);

    protected deleteRow() {
        const handbookId = this.handbook()?.id;
        const rowId = this.row()?.id;

        if (!handbookId || !rowId) {
            return;
        }

        const payload = {rowIds: [rowId]};

        this.handbookService
            .deleteHandbookRows(handbookId, payload)
            .pipe(
                tap(() =>
                    this.alerts
                        .open('Строка успешно удалена', {
                            label: 'Готово',
                            appearance: 'positive'
                        })
                        .subscribe()
                ),
                catchError(() => {
                    this.alerts
                        .open('Не удалось удалить строку. Попробуйте еще раз', {
                            label: 'Ошибка',
                            appearance: 'negative'
                        })
                        .subscribe();
                    return EMPTY;
                })
            )
            .subscribe(() => {
                this.deletedRowId.emit(rowId);
            });
    }

    protected cloneRow() {
        const handbookId = this.handbook()?.id;
        const rowId = this.row()?.id;

        if (!handbookId || !rowId) {
            return;
        }

        const payload = {rowIds: [rowId]};

        this.handbookService
            .cloneHandbookRows(handbookId, payload)
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
                            {
                                label: 'Ошибка',
                                appearance: 'negative'
                            }
                        )
                        .subscribe();
                    return EMPTY;
                })
            )
            .subscribe(rows => {
                this.clonedRows.emit(rows);
            });
    }

    protected openEditRowDialog(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        const handbook = this.handbook();
        const row = this.row();

        if (!handbook || !row) {
            return;
        }

        this.sidebarService
            .open$<AddHandbookStringFormComponent, HandbookRow>(
                new PolymorpheusComponent(AddHandbookStringFormComponent),
                {
                    overlay: true,
                    rounded: true,
                    offset: true
                },
                {
                    handbook,
                    editRow: row
                }
            )
            .subscribe(updatedRow => {
                if (updatedRow) {
                    this.updatedRow.emit(updatedRow);
                }
            });
    }
}
