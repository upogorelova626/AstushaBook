import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    OnInit
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';
import {TuiRadio} from '@taiga-ui/core';
import {HandbooksListService} from '../../../services/handbooks-list.service';
import {distinctUntilChanged} from 'rxjs';
import {HandbookListFilter} from '../../../../../shared/interfaces';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

interface HandbookFilterItem {
    readonly value: HandbookListFilter;
    readonly label: string;
    readonly icon: string;
    readonly count: number;
}

@Component({
    selector: 'app-handbooks-filters',
    imports: [ReactiveFormsModule, TuiAvatar, TuiBadge, TuiRadio],
    templateUrl: './handbooks-filters.component.html',
    styleUrl: './handbooks-filters.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbooksFiltersComponent implements OnInit {
    private readonly handbooksListService = inject(HandbooksListService);

    private readonly destroyRef = inject(DestroyRef);

    protected readonly filters: readonly HandbookFilterItem[] = [
        {
            value: HandbookListFilter.All,
            label: 'Все',
            icon: '@tui.users',
            count: 48
        },
        {
            value: HandbookListFilter.Mine,
            label: 'Мои',
            icon: '@tui.user',
            count: 12
        },
        {
            value: HandbookListFilter.Available,
            label: 'Доступные мне',
            icon: '@tui.user-round-check',
            count: 17
        },
        {
            value: HandbookListFilter.Favorites,
            label: 'Избранные',
            icon: '@tui.star',
            count: 6
        }
    ];

    protected readonly filterControl = new FormControl<HandbookListFilter>(
        HandbookListFilter.All,
        {
            nonNullable: true
        }
    );

    ngOnInit(): void {
        this.filterControl.valueChanges
            .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                this.handbooksListService.updateRequest({filter: value});
            });
    }
}
