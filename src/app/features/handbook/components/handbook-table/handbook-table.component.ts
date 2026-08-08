import {DatePipe} from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
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

import {
    Handbook,
    HandbookColumnType,
    HandbookRow
} from '../../../../shared/interfaces';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {AddHandbookStringFormComponent} from '../add-handbook-string-form/add-handbook-string-form.component';
import {EditRowButtonComponent} from '../edit-row-button/edit-row-button.component';
import {HandbookTableService} from '../../services/handbook-table.service';
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
    private readonly handbookTableService = inject(HandbookTableService);

    private observer!: IntersectionObserver;

    protected readonly originalRows = this.handbookTableService.originalRows;
    protected readonly draftRows = this.handbookTableService.draftRows;

    protected readonly isLoading = this.handbookTableService.isLoading;
    protected readonly isEditing = this.handbookTableService.isEditing;

    protected readonly changedRowsId = signal<string[]>([]);

    protected readonly editingCell = this.handbookTableService.editingCell;

    protected readonly editCellControl = new FormControl<
        string | number | boolean | null
    >(null);

    protected readonly HandbookColumnType = HandbookColumnType;

    ngAfterViewInit() {
        this.observer = new IntersectionObserver(entries => {
            const trigger = entries[0];

            if (!trigger.isIntersecting) {
                return;
            }

            const handbookId = this.handbook()?.id;

            if (!handbookId) {
                return;
            }

            this.handbookTableService.getMoreRows(handbookId);
        });

        this.observer.observe(this.loadMore.nativeElement);
    }

    ngOnDestroy() {
        this.observer.disconnect();
    }

    protected isCellEditing(rowId: string, columnId: string): boolean {
        const editingCell = this.editingCell();

        return (
            editingCell?.rowId === rowId && editingCell.columnId === columnId
        );
    }

    protected startEditing(rowId: string, columnId: string) {
        if (!this.isEditing()) {
            return;
        }

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
        this.originalRows.update(rows =>
            rows.map(row => (row.id === updatedRow.id ? updatedRow : row))
        );

        this.draftRows.update(rows =>
            rows.map(row => (row.id === updatedRow.id ? updatedRow : row))
        );
    }

    protected deleteRow(deletedRowId: string) {
        this.originalRows.update(rows =>
            rows.filter(row => row.id !== deletedRowId)
        );

        this.draftRows.update(rows =>
            rows.filter(row => row.id !== deletedRowId)
        );
    }

    protected addRows(newRows: HandbookRow[]): void {
        this.originalRows.update(rows => [...rows, ...newRows]);

        this.draftRows.update(rows => [...rows, ...newRows]);
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

                this.originalRows.update(rows => [...rows, row]);
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
}
