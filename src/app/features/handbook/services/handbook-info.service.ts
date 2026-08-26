import {computed, inject, Injectable, signal} from '@angular/core';
import {
    Handbook,
    HandbookRow,
    UpdateHandbookRowsRequest
} from '../../../shared/interfaces';
import {HandbookService} from '../../../shared/services/handbook.service';
import {catchError, EMPTY, finalize, tap} from 'rxjs';

import {TuiNotificationService} from '@taiga-ui/core';

@Injectable()
export class HandbookInfoService {
    private readonly handbookService = inject(HandbookService);
    private readonly alerts = inject(TuiNotificationService);

    private readonly isHandbookLoading = signal(false);
    private readonly areRowsLoading = signal(false);

    protected readonly nextOffset = signal<number | null>(0);

    payload = signal<UpdateHandbookRowsRequest | null>(null);

    readonly originalRows = signal<HandbookRow[]>([]);
    readonly draftRows = signal<HandbookRow[]>([]);

    readonly handbook = signal<Handbook | null>(null);

    readonly isLoading = computed(
        () => this.isHandbookLoading() || this.areRowsLoading()
    );
    readonly isEditing = signal(false);

    readonly editingCell = signal<{
        rowId: string;
        columnId: string;
    } | null>(null);

    readonly changedRowsId = signal<string[]>([]);

    getHandbook(handbookId: string) {
        this.isHandbookLoading.set(true);
        this.handbookService
            .getHandbook(handbookId)
            .pipe(
                catchError(() => {
                    return EMPTY;
                }),
                finalize(() => {
                    this.isHandbookLoading.set(false);
                })
            )
            .subscribe(handbook => {
                this.handbook.set(handbook);
            });
    }

    getHandbookRows(handbookId: string) {
        this.areRowsLoading.set(true);
        this.handbookService
            .getHandbookRows(handbookId, {offset: 0})
            .pipe(
                finalize(() => {
                    this.areRowsLoading.set(false);
                })
            )
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
            this.isEditing.set(false);
            return;
        }

        this.handbookService
            .editHandbookRows(handbookId, payload)
            .pipe(
                tap(() => {
                    this.alerts
                        .open('Изменения успешно сохранены', {
                            label: 'Готово',
                            appearance: 'positive'
                        })
                        .subscribe();
                    this.isEditing.set(false);
                }),
                catchError(() => {
                    this.alerts
                        .open('Не удалось сохранить изменения', {
                            label: 'Ошибка',
                            appearance: 'negative'
                        })
                        .subscribe();
                    return EMPTY;
                })
            )
            .subscribe();
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
