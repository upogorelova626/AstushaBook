import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
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

    ngOnInit(): void {
        this.handbooksListService.load();
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
