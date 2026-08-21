import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiExpand} from '@taiga-ui/core';
import {TuiAvatar, TuiBadge, TuiChevron} from '@taiga-ui/kit';
import {RecentlyViewedHandbooksService} from '../../../services/recently-viewed-handbooks.service';

@Component({
    selector: 'app-recently-viewed-handbooks',
    imports: [TuiButton, TuiAvatar, TuiBadge, TuiExpand, TuiChevron],
    templateUrl: './recently-viewed-handbooks.component.html',
    styleUrl: './recently-viewed-handbooks.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentlyViewedHandbooksComponent {
    protected expanded = false;

    private readonly recentlyViewedHandbooksService = inject(
        RecentlyViewedHandbooksService
    );

    protected readonly recentlyViewedhandbooks =
        this.recentlyViewedHandbooksService.recentlyViewedHandbooks;
}
