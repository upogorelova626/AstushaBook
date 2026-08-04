import {Component, inject, input, output} from '@angular/core';
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
    styleUrl: './edit-row-button.component.less'
})
export class EditRowButtonComponent {
    readonly handbook = input<Handbook | null>(null);
    readonly row = input<HandbookRow>();

    readonly updatedRow = output<HandbookRow>();
    readonly deletedRowId = output<string>();

    private readonly sidebarService = inject(SideBarService);
    private readonly handbookService = inject(HandbookService);
    private alerts = inject(TuiNotificationService);

    protected deleteRow() {
        const handbookId = this.handbook()?.id;
        const rowId = this.row()?.id;

        if (!handbookId || !rowId) {
            return;
        }

        const payload = {rowIds: [rowId]};

        this.handbookService
            .deleteHandbookRow(handbookId, payload)
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
        return;
    }

    protected openEditRowDialog(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.sidebarService
            .open$<AddHandbookStringFormComponent, HandbookRow>(
                new PolymorpheusComponent(AddHandbookStringFormComponent),
                {
                    overlay: true,
                    rounded: true,
                    offset: true
                },
                {
                    handbook: this.handbook(),
                    editRow: this.row()
                }
            )
            .subscribe(updatedRow => {
                if (updatedRow) {
                    this.updatedRow.emit(updatedRow);
                }
            });
    }
}
