import {DatePipe} from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    Injector,
    input,
    OnDestroy,
    signal,
    ViewChild
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiTable} from '@taiga-ui/addon-table';
import {
    TuiButton,
    TuiCalendar,
    TuiCheckbox,
    TuiInput,
    TuiTextfield
} from '@taiga-ui/core';
import {TuiInputDate, TuiSkeleton} from '@taiga-ui/kit';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {finalize} from 'rxjs';
import {
    Handbook,
    HandbookColumnType,
    HandbookRow,
    UpdateHandbookRowsRequest
} from '../../../../shared/interfaces';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {AddHandbookStringFormComponent} from '../add-handbook-string-form/add-handbook-string-form.component';
import {EditRowButtonComponent} from '../edit-row-button/edit-row-button.component';

@Component({
    selector: 'app-handbook-table',
    imports: [
        DatePipe,
        ReactiveFormsModule,
        TuiTable,
        TuiButton,
        TuiCheckbox,
        TuiSkeleton,
        TuiTextfield,
        TuiInput,
        TuiInputDate,
        TuiCalendar,
        EditRowButtonComponent
    ],
    templateUrl: './handbook-table.component.html',
    styleUrl: './handbook-table.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookTableComponent implements AfterViewInit, OnDestroy {
    @ViewChild('loadMore')
    private loadMore!: ElementRef<HTMLElement>;

    readonly handbook = input<Handbook | null>(null);

    private readonly sidebarService = inject(SideBarService);
    private readonly handbookService = inject(HandbookService);
    private readonly injector = inject(Injector);

    private observer!: IntersectionObserver;

    protected readonly rows = signal<HandbookRow[]>([]);
    protected readonly draftRows = signal<HandbookRow[]>([]);
    protected readonly changedRowsId = signal<string[]>([]);

    protected readonly nextOffset = signal<number | null>(0);
    protected readonly isLoading = signal(false);

    protected readonly editingCell = signal<{
        rowId: string;
        columnId: string;
    } | null>(null);

    protected readonly editCellControl = new FormControl<
        string | number | boolean | null
    >(null);

    protected readonly HandbookColumnType = HandbookColumnType;

    constructor() {
        effect(() => {
            const handbookId = this.handbook()?.id;

            if (!handbookId) {
                return;
            }

            this.isLoading.set(true);

            this.handbookService
                .getHandbookRows(handbookId, {offset: 0})
                .pipe(finalize(() => this.isLoading.set(false)))
                .subscribe(result => {
                    this.rows.set(result.items);
                    this.draftRows.set(result.items);
                    this.nextOffset.set(result.nextOffset);
                });
        });
    }

    ngAfterViewInit() {
        this.observer = new IntersectionObserver(entries => {
            const trigger = entries[0];

            if (!trigger.isIntersecting) {
                return;
            }

            const handbookId = this.handbook()?.id;
            const offset = this.nextOffset();

            if (!handbookId || offset === null) {
                return;
            }

            this.handbookService
                .getHandbookRows(handbookId, {offset})
                .subscribe(result => {
                    this.rows.update(currentRows => [
                        ...currentRows,
                        ...result.items
                    ]);

                    this.draftRows.update(currentRows => [
                        ...currentRows,
                        ...result.items
                    ]);

                    this.nextOffset.set(result.nextOffset);
                });
        });

        this.observer.observe(this.loadMore.nativeElement);
    }

    ngOnDestroy() {
        this.observer.disconnect();
    }

    protected startEditing(rowId: string, columnId: string) {
        this.saveCurrentCellToDraft();

        const draftRow = this.draftRows().find(row => row.id === rowId);

        if (!draftRow) {
            return;
        }

        this.editingCell.set({
            rowId,
            columnId
        });

        this.editCellControl.setValue(draftRow.values[columnId] ?? null);
    }

    protected cancelEditing() {
        const originalRows = this.rows().map(row => ({
            ...row,
            values: {...row.values}
        }));

        this.draftRows.set(originalRows);
        this.changedRowsId.set([]);
        this.editingCell.set(null);
    }

    protected isEditing(rowId: string, columnId: string): boolean {
        const editingCell = this.editingCell();

        return (
            editingCell?.rowId === rowId && editingCell.columnId === columnId
        );
    }

    protected saveChanges(): void {
        this.saveCurrentCellToDraft();

        const handbookId = this.handbook()?.id;
        const changedRowsIds = new Set(this.changedRowsId());

        if (!handbookId || changedRowsIds.size === 0) {
            return;
        }

        const changedRows = this.draftRows()
            .filter(row => changedRowsIds.has(row.id))
            .map(row => ({
                id: row.id,
                values: {...row.values}
            }));

        const payload: UpdateHandbookRowsRequest = {
            rows: changedRows
        };

        this.handbookService
            .editHandbookRows(handbookId, payload)
            .subscribe(updatedRows => {
                const updatedRowsById = new Map(
                    updatedRows.map(row => [row.id, row])
                );

                this.rows.update(rows =>
                    rows.map(row => {
                        const updatedRow = updatedRowsById.get(row.id);

                        return updatedRow
                            ? {
                                  ...updatedRow,
                                  values: {...updatedRow.values}
                              }
                            : row;
                    })
                );

                this.draftRows.update(rows =>
                    rows.map(row => {
                        const updatedRow = updatedRowsById.get(row.id);

                        return updatedRow
                            ? {
                                  ...updatedRow,
                                  values: {...updatedRow.values}
                              }
                            : row;
                    })
                );

                this.changedRowsId.set([]);
                this.editingCell.set(null);
            });
    }

    protected createAttribute(event: MouseEvent) {
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
                    handbook: this.handbook()
                }
            )
            .subscribe(row => {
                if (!row) {
                    return;
                }

                this.rows.update(rows => [...rows, row]);
                this.draftRows.update(rows => [...rows, row]);
            });
    }

    protected getDateValue(
        value: string | number | boolean | null
    ): string | number | null {
        return typeof value === 'string' || typeof value === 'number'
            ? value
            : null;
    }

    private saveCurrentCellToDraft() {
        const editingCell = this.editingCell();

        if (!editingCell) {
            return;
        }

        const value = this.editCellControl.value;

        this.changedRowsId.update(currentValues =>
            currentValues.includes(editingCell.rowId)
                ? currentValues
                : [...currentValues, editingCell.rowId]
        );

        this.draftRows.update(rows =>
            rows.map(row => {
                if (row.id !== editingCell.rowId) {
                    return row;
                }

                return {
                    ...row,
                    values: {
                        ...row.values,
                        [editingCell.columnId]: value
                    }
                };
            })
        );
    }

    protected updateRows(updatedRow: HandbookRow) {
        this.draftRows.update(rows =>
            rows.map(row => (row.id === updatedRow.id ? updatedRow : row))
        );
        this.rows.update(rows =>
            rows.map(row => (row.id === updatedRow.id ? updatedRow : row))
        );
    }

    protected deleteRow(deletedRowId: string) {
        this.draftRows.update(rows =>
            rows.filter(row => row.id !== deletedRowId)
        );

        this.rows.update(rows => rows.filter(row => row.id !== deletedRowId));
    }
}
