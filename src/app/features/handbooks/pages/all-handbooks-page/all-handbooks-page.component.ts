import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {HandbooksFiltersComponent} from '../../components/all-handbooks-components/handbooks-filters/handbooks-filters.component';
import {HandbookToolbarComponent} from '../../components/all-handbooks-components/handbook-toolbar/handbook-toolbar.component';
import {HandbooksGuideCardComponent} from '../../components/all-handbooks-components/handbooks-guide-card/handbooks-guide-card.component';
import {HandbooksListComponent} from '../../components/all-handbooks-components/handbooks-list/handbooks-list.component';
import {RecentlyViewedHandbooksComponent} from '../../components/all-handbooks-components/recently-viewed-handbooks/recently-viewed-handbooks.component';
import {HandbooksListService} from '../../services/handbooks-list.service';
import {RecentlyViewedHandbooksService} from '../../services/recently-viewed-handbooks.service';

@Component({
    selector: 'app-all-handbooks-page',
    imports: [
        HandbooksFiltersComponent,
        HandbookToolbarComponent,
        HandbooksGuideCardComponent,
        HandbooksListComponent,
        RecentlyViewedHandbooksComponent
    ],
    templateUrl: './all-handbooks-page.component.html',
    styleUrl: './all-handbooks-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllHandbooksPageComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('loadMore')
    private loadMore!: ElementRef<HTMLElement>;
    private observer!: IntersectionObserver;

    private readonly handbooksListService = inject(HandbooksListService);

    private readonly recentlyViewedHandbooksService = inject(
        RecentlyViewedHandbooksService
    );

    protected readonly isRecentlyViewedVisible = computed(() => {
        const recentlyViewedItems =
            this.recentlyViewedHandbooksService.recentlyViewedItemIds();

        if (recentlyViewedItems.length === 0) {
            return false;
        }
        return true;
    });

    protected readonly isLoading = this.handbooksListService.isLoading();

    ngOnInit() {
        this.handbooksListService.load();

        this.recentlyViewedHandbooksService.getRecentlyViewedHandbooks();
    }

    ngAfterViewInit() {
        this.observer = new IntersectionObserver(entries => {
            const trigger = entries[0];

            if (trigger.isIntersecting) {
                this.handbooksListService.loadMore();
            }
        });

        this.observer.observe(this.loadMore.nativeElement);
    }

    ngOnDestroy() {
        this.observer.disconnect();
    }
}
