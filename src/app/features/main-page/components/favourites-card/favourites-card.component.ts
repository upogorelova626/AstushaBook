import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiAvatar, TuiSkeleton} from '@taiga-ui/kit';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {
    GetHandbooksRequest,
    HandbookListFilter,
    HandbookPreview
} from '../../../../shared/interfaces';
import {HandbookPreviewItemComponent} from '../../../../shared/components/handbook-preview-item/handbook-preview-item.component';
import {RouterLink} from '@angular/router';
import {finalize} from 'rxjs';

@Component({
    selector: 'app-favourites-card',
    imports: [
        TuiAvatar,
        TuiButton,
        HandbookPreviewItemComponent,
        RouterLink,
        TuiSkeleton
    ],
    templateUrl: './favourites-card.component.html',
    styleUrl: './favourites-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavouritesCardComponent implements OnInit {
    private readonly handbooksService = inject(HandbookService);

    protected readonly favoriteHandbooks = signal<HandbookPreview[]>([]);

    protected readonly isLoading = signal(false);

    readonly handbookRequest = signal<GetHandbooksRequest>({
        name: '',
        tags: [],
        filter: HandbookListFilter.Favorites
    });

    ngOnInit() {
        const payload = this.handbookRequest();

        this.isLoading.set(true);

        this.handbooksService
            .getHandbooksPreviews(payload)
            .pipe(
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(result => {
                this.favoriteHandbooks.set(result.items);
            });
    }
}
