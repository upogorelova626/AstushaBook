import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';
import {TuiRadio} from '@taiga-ui/core';

type HandbookFilterValue =
    | 'ALL'
    | 'OWNED'
    | 'AVAILABLE'
    | 'FAVORITES'
    | 'RECENT';

interface HandbookFilterItem {
    readonly value: HandbookFilterValue;
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
export class HandbooksFiltersComponent {
    protected readonly filters: readonly HandbookFilterItem[] = [
        {
            value: 'ALL',
            label: 'Все',
            icon: '@tui.users',
            count: 48
        },
        {
            value: 'OWNED',
            label: 'Мои',
            icon: '@tui.user',
            count: 12
        },
        {
            value: 'AVAILABLE',
            label: 'Доступные мне',
            icon: '@tui.user-round-check',
            count: 17
        },
        {
            value: 'FAVORITES',
            label: 'Избранные',
            icon: '@tui.star',
            count: 6
        },
        {
            value: 'RECENT',
            label: 'Недавно просмотренные',
            icon: '@tui.clock-4',
            count: 8
        }
    ];

    protected readonly filterControl = new FormControl<HandbookFilterValue>(
        'ALL',
        {
            nonNullable: true
        }
    );
}
