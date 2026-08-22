import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiAvatar, TuiSkeleton} from '@taiga-ui/kit';
import {RecentlyViewedHandbooksService} from '../../../handbooks/services/recently-viewed-handbooks.service';
import {HandbookPreviewItemComponent} from '../../../../shared/components/handbook-preview-item/handbook-preview-item.component';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-continue-reading-card',
    imports: [
        TuiButton,
        TuiAvatar,
        TuiSkeleton,
        HandbookPreviewItemComponent,
        RouterLink
    ],
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
