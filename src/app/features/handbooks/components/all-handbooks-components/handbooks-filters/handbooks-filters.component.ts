import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    OnInit
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiAvatar, TuiBadge, TuiSkeleton} from '@taiga-ui/kit';
import {TuiRadio} from '@taiga-ui/core';
import {HandbooksListService} from '../../../services/handbooks-list.service';
import {distinctUntilChanged} from 'rxjs';
import {HandbookListFilter} from '../../../../../shared/interfaces';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-handbooks-filters',
    imports: [ReactiveFormsModule, TuiAvatar, TuiBadge, TuiRadio, TuiSkeleton],
    templateUrl: './handbooks-filters.component.html',
    styleUrl: './handbooks-filters.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbooksFiltersComponent implements OnInit {
    private readonly handbooksListService = inject(HandbooksListService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly handbookFilterCounts =
        this.handbooksListService.handbookFilterCounts;

    protected readonly isFiltersLoading =
        this.handbooksListService.isFiltersLoading;

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

        this.handbooksListService.getHandbooksFiltersCount();
    }
}
