import {inject, Injectable, signal} from '@angular/core';
import {
    GetHandbooksRequest,
    HandbookFiltersCounts,
    HandbookListFilter,
    HandbookPreview
} from '../../../shared/interfaces';
import {HandbookService} from '../../../shared/services/handbook.service';
import {finalize} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HandbooksListService {
    private readonly handbookService = inject(HandbookService);

    readonly handbookFilterCounts = signal<HandbookFiltersCounts | null>(null);

    readonly handbookRequest = signal<GetHandbooksRequest>({
        name: '',
        tags: [],
        filter: HandbookListFilter.All
    });

    readonly handbooksPreviews = signal<HandbookPreview[]>([]);
    readonly isLoading = signal(false);
    readonly isFiltersLoading = signal(false);
    readonly nextOffset = signal<number | null>(null);

    load() {
        this.isLoading.set(true);

        const request = this.handbookRequest();

        this.handbookService
            .getHandbooksPreviews(request)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(handbooksPreviews => {
                this.handbooksPreviews.set(handbooksPreviews.items);
                this.nextOffset.set(handbooksPreviews.nextOffset);
            });
    }

    loadMore() {
        const offset = this.nextOffset();

        if (offset === null || this.isLoading()) {
            return;
        }

        this.isLoading.set(true);
        const request = this.handbookRequest();
        const payload = {
            name: request.name,
            tags: request.tags,
            filter: request.filter,
            offset: offset
        };

        this.handbookService
            .getHandbooksPreviews(payload)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(handbooksPreviews => {
                this.handbooksPreviews.update(currentValues => [
                    ...currentValues,
                    ...handbooksPreviews.items
                ]);
                this.nextOffset.set(handbooksPreviews.nextOffset);
            });
    }

    updateRequest(values: Partial<Omit<GetHandbooksRequest, 'offset'>>) {
        this.handbookRequest.update(currentValues => ({
            ...currentValues,
            ...values
        }));
        this.load();
    }

    updateHandbookFavouriteStatus(handbookId: string, isFavorite: boolean) {
        this.handbooksPreviews.update(handbooks =>
            handbooks.map(handbook =>
                handbook.id === handbookId
                    ? {
                          ...handbook,
                          isFavorite
                      }
                    : handbook
            )
        );
    }

    getHandbooksFiltersCount() {
        this.isFiltersLoading.set(true);

        this.handbookService
            .getHandbooksCount()
            .pipe(finalize(() => this.isFiltersLoading.set(false)))
            .subscribe(result => this.handbookFilterCounts.set(result));
    }
}
