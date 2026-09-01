import {DatePipe} from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    OnDestroy,
    signal,
    ViewChild
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiTable} from '@taiga-ui/addon-table';
import {TuiCalendar, TuiCheckbox, TuiInput, TuiTextfield} from '@taiga-ui/core';
import {TuiInputDate} from '@taiga-ui/kit';
import {
    AstushaUserPreview,
    HandbookColumnType,
    HandbookRow
} from '../../../../shared/interfaces';
import {EditRowButtonComponent} from '../edit-row-button/edit-row-button.component';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {TuiEditorSocket} from '@taiga-ui/editor';
import {AddHandbookRowButtonComponent} from '../add-handbook-row-button/add-handbook-row-button.component';
import {UserService} from '../../../../shared/services/user.service';
import {HandbookInfoService} from '../../services/handbook-info.service';

@Component({
    selector: 'app-handbook-table',
    imports: [
        DatePipe,
        ReactiveFormsModule,
        TuiTable,
        TuiCheckbox,

        TuiTextfield,
        TuiInput,
        TuiInputDate,
        TuiCalendar,
        TuiEditorSocket,
        EditRowButtonComponent,
        AddHandbookRowButtonComponent
    ],
    templateUrl: './handbook-table.component.html',
    styleUrl: './handbook-table.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookTableComponent implements AfterViewInit, OnDestroy {
    @ViewChild('loadMore')
    private loadMore!: ElementRef<HTMLElement>;

    private readonly userService = inject(UserService);
    private readonly handbookInfoService = inject(HandbookInfoService);

    private readonly destroyRef = inject(DestroyRef);

    private observer!: IntersectionObserver;

    protected readonly currentUser = toSignal(this.userService.currentUser$);

    protected readonly originalRows = this.handbookInfoService.originalRows;
    protected readonly draftRows = this.handbookInfoService.draftRows;

    protected readonly isEditing = this.handbookInfoService.isEditing;

    protected readonly changedRowsId = signal<string[]>([]);

    protected readonly editingCell = this.handbookInfoService.editingCell;

    protected readonly editCellControl = new FormControl<
        string | number | boolean | null | AstushaUserPreview
    >(null);

    protected readonly HandbookColumnType = HandbookColumnType;

    protected readonly canEditHandbook = computed(() => {
        const currentUserId = this.currentUser()?.id;

        if (!currentUserId) {
            return false;
        }

        return (
            this.handbook()?.editors.some(
                editor => editor.userId === currentUserId
            ) ?? false
        );
    });

    readonly handbook = this.handbookInfoService.handbook;

    constructor() {
        this.editCellControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                const editingCell = this.editingCell();

                if (!editingCell) {
                    return;
                }
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
            });
    }

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

            this.handbookInfoService.getMoreRows(handbookId);
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

    protected addRows(newRows: HandbookRow[]) {
        this.originalRows.update(rows => [...rows, ...newRows]);

        this.draftRows.update(rows => [...rows, ...newRows]);
    }

    protected getDateValue(
        value: string | number | boolean | null | AstushaUserPreview
    ): string | number | null {
        return typeof value === 'string' || typeof value === 'number'
            ? value
            : null;
    }

    protected getUser(
        value: string | number | boolean | null | AstushaUserPreview
    ): string | null {
        if (typeof value !== 'object' || value === null) {
            return null;
        }

        const fullName = [value.firstName, value.lastName]
            .filter(Boolean)
            .join(' ');

        return fullName || value.login;
    }

    protected getValue(
        value: string | number | boolean | null | AstushaUserPreview
    ): string | null {
        return typeof value === 'string' ? value : null;
    }
}
