import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiAvatar, TuiSkeleton} from '@taiga-ui/kit';
import {RecentlyViewedHandbooksService} from '../../../handbooks/services/recently-viewed-handbooks.service';
import {HandbooksListItemComponent} from '../../../handbooks/components/all-handbooks-components/handbooks-list/handbooks-list-item/handbooks-list-item.component';

@Component({
    selector: 'app-continue-reading-card',
    imports: [TuiAvatar, TuiSkeleton, HandbooksListItemComponent],
    templateUrl: './continue-reading-card.component.html',
    styleUrl: './continue-reading-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContinueReadingCardComponent {
    private readonly recentlyViewedHandbooksService = inject(
        RecentlyViewedHandbooksService
    );

    protected readonly recentlyViewedhandbooks =
        this.recentlyViewedHandbooksService.recentlyViewedHandbooks;

    protected readonly isLoading =
        this.recentlyViewedHandbooksService.isLoading;
}
