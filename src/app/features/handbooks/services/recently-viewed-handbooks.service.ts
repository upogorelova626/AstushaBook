import {inject, Injectable, signal} from '@angular/core';
import {catchError, EMPTY, finalize} from 'rxjs';
import {HandbookPreview} from '../../../shared/interfaces';
import {HandbookService} from '../../../shared/services/handbook.service';

@Injectable({
    providedIn: 'root'
})
export class RecentlyViewedHandbooksService {
    private readonly handbookService = inject(HandbookService);

    readonly recentlyViewedItemIds = signal<string[]>([]);

    readonly recentlyViewedHandbooks = signal<HandbookPreview[]>([]);

    readonly isLoading = signal(false);

    constructor() {
        this.getValuesFromLocalStorage();
    }

    getValuesFromLocalStorage() {
        const recentlyViewedHandbooks = localStorage.getItem('recently-viewed');

        if (!recentlyViewedHandbooks) {
            this.recentlyViewedItemIds.set([]);

            return;
        }

        this.recentlyViewedItemIds.set(JSON.parse(recentlyViewedHandbooks));
    }

    addHandbookIdToLocalStorage(handbookId: string) {
        this.recentlyViewedItemIds.update(currentItems =>
            [handbookId, ...currentItems.filter(id => id !== handbookId)].slice(
                0,
                5
            )
        );

        localStorage.setItem(
            'recently-viewed',
            JSON.stringify(this.recentlyViewedItemIds())
        );
    }

    getRecentlyViewedHandbooks() {
        const ids = this.recentlyViewedItemIds();

        if (ids.length === 0) {
            this.recentlyViewedHandbooks.set([]);

            return;
        }
        this.isLoading.set(true);

        this.handbookService
            .getRecentlyViewedHandbooks({
                ids
            })
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                }),
                catchError(() => {
                    this.recentlyViewedHandbooks.set([]);

                    return EMPTY;
                })
            )
            .subscribe(handbooks => {
                this.recentlyViewedHandbooks.set(handbooks);
            });
    }
}
