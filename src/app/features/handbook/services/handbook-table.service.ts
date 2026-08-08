import {inject, Injectable, signal} from '@angular/core';
import {
    HandbookRow,
    UpdateHandbookRowsRequest
} from '../../../shared/interfaces';
import {HandbookService} from '../../../shared/services/handbook.service';
import {finalize} from 'rxjs';

@Injectable()
export class HandbookTableService {
    private readonly handbookService = inject(HandbookService);

    payload = signal<UpdateHandbookRowsRequest | null>(null);

    readonly originalRows = signal<HandbookRow[]>([]);
    readonly draftRows = signal<HandbookRow[]>([]);

    readonly isLoading = signal(false);
    readonly isEditing = signal(false);

    readonly editingCell = signal<{
        rowId: string;
        columnId: string;
    } | null>(null);

    readonly changedRowsId = signal<string[]>([]);

    protected readonly nextOffset = signal<number | null>(0);

    getHandbookRows(handbookId: string) {
        this.isLoading.set(true);
        this.handbookService
            .getHandbookRows(handbookId, {offset: 0})
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(result => {
                this.originalRows.set(result.items);
                this.draftRows.set(result.items);
                this.nextOffset.set(result.nextOffset);
            });
    }

    getMoreRows(handbookId: string) {
        const offset = this.nextOffset();

        if (!handbookId || offset === null) {
            return;
        }

        this.handbookService
            .getHandbookRows(handbookId, {offset})
            .subscribe(result => {
                this.originalRows.update(currentRows => [
                    ...currentRows,
                    ...result.items
                ]);

                this.draftRows.update(currentRows => [
                    ...currentRows,
                    ...result.items
                ]);

                this.nextOffset.set(result.nextOffset);
            });
    }

    startEditing() {
        this.isEditing.set(true);
    }

    cancelEditing() {
        const originalRows = this.originalRows().map(row => ({
            ...row,
            values: {...row.values}
        }));

        this.draftRows.set(originalRows);
        this.changedRowsId.set([]);
        this.editingCell.set(null);
        this.isEditing.set(false);
    }

    editHandbookRows(handbookId: string) {
        this.getPayload();

        const payload = this.payload();

        if (!payload) {
            return;
        }

        this.handbookService.editHandbookRows(handbookId, payload).subscribe();
    }

    getPayload() {
        const draftRows = this.draftRows();
        const originalRows = this.originalRows();

        const changedRows = draftRows.filter(draftRow => {
            const originalRow = originalRows.find(
                row => row.id === draftRow.id
            );

            if (!originalRow) {
                return true;
            }

            return Object.keys(draftRow.values).some(
                columnId =>
                    draftRow.values[columnId] !== originalRow.values[columnId]
            );
        });

        this.payload.set({
            rows: changedRows.map(row => ({
                id: row.id,
                values: row.values
            }))
        });
    }
}
