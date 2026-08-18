import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiAvatar, TuiBadge, TuiSkeleton} from '@taiga-ui/kit';
import {TuiRadio} from '@taiga-ui/core';
import {HandbooksListService} from '../../../services/handbooks-list.service';
import {distinctUntilChanged, finalize} from 'rxjs';
import {
    HandbookFiltersCounts,
    HandbookListFilter
} from '../../../../../shared/interfaces';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HandbookService} from '../../../../../shared/services/handbook.service';

@Component({
    selector: 'app-handbooks-filters',
    imports: [ReactiveFormsModule, TuiAvatar, TuiBadge, TuiRadio, TuiSkeleton],
    templateUrl: './handbooks-filters.component.html',
    styleUrl: './handbooks-filters.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbooksFiltersComponent implements OnInit {
    private readonly handbooksListService = inject(HandbooksListService);
    private readonly HandbookService = inject(HandbookService);

    private readonly handbookFilterCounts =
        signal<HandbookFiltersCounts | null>(null);

    private readonly destroyRef = inject(DestroyRef);

    protected readonly isLoading = signal(false);

    protected readonly filters = computed(() => {
        const counts = this.handbookFilterCounts();

        return [
            {
                value: HandbookListFilter.All,
                label: 'Все',
                icon: '@tui.users',
                count: counts?.all
            },
            {
                value: HandbookListFilter.Mine,
                label: 'Мои',
                icon: '@tui.user',
                count: counts?.mine
            },
            {
                value: HandbookListFilter.Available,
                label: 'Доступные мне',
                icon: '@tui.user-round-check',
                count: counts?.available
            },
            {
                value: HandbookListFilter.Favorites,
                label: 'Избранные',
                icon: '@tui.star',
                count: counts?.favorites
            }
        ];
    });
    protected readonly filterControl = new FormControl<HandbookListFilter>(
        HandbookListFilter.All,
        {
            nonNullable: true
        }
    );

    ngOnInit() {
        this.filterControl.valueChanges
            .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                this.handbooksListService.updateRequest({filter: value});
            });

        this.isLoading.set(true);

        this.HandbookService.getHandbooksCount()
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe(result => this.handbookFilterCounts.set(result));
    }
}
