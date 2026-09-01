import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject
} from '@angular/core';
import {TuiButton, TuiExpand} from '@taiga-ui/core';
import {TuiAvatar, TuiChevron} from '@taiga-ui/kit';
import {RecentlyViewedHandbooksService} from '../../../services/recently-viewed-handbooks.service';
import {HandbooksListItemComponent} from '../handbooks-list/handbooks-list-item/handbooks-list-item.component';

@Component({
    selector: 'app-recently-viewed-handbooks',
    imports: [
        TuiButton,
        TuiAvatar,
        TuiExpand,
        TuiChevron,
        HandbooksListItemComponent
    ],
    templateUrl: './recently-viewed-handbooks.component.html',
    styleUrl: './recently-viewed-handbooks.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentlyViewedHandbooksComponent {
    private readonly recentlyViewedHandbooksService = inject(
        RecentlyViewedHandbooksService
    );

    protected expanded = false;

    protected readonly recentlyViewedHandbooks =
        this.recentlyViewedHandbooksService.recentlyViewedHandbooks;

    protected readonly displayedHandbooks = computed(() =>
        this.recentlyViewedHandbooks().slice(0, 3)
    );
}
