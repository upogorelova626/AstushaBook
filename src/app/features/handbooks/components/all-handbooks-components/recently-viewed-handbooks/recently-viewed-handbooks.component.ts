import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiExpand, TuiAppearance} from '@taiga-ui/core';
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
        TuiAppearance,
        HandbooksListItemComponent
    ],
    templateUrl: './recently-viewed-handbooks.component.html',
    styleUrl: './recently-viewed-handbooks.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentlyViewedHandbooksComponent {
    protected expanded = true;

    private readonly recentlyViewedHandbooksService = inject(
        RecentlyViewedHandbooksService
    );

    protected readonly recentlyViewedHandbooks =
        this.recentlyViewedHandbooksService.recentlyViewedHandbooks;
}
