import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnInit
} from '@angular/core';
import {WelcomeCardComponent} from '../components/welcome-card/welcome-card.component';
import {ContinueReadingCardComponent} from '../components/continue-reading-card/continue-reading-card.component';
import {PopularDirectoriesCardComponent} from '../components/popular-directories-card/popular-directories-card.component';
import {FavouritesCardComponent} from '../components/favourites-card/favourites-card.component';
import {RecentlyViewedHandbooksService} from '../../handbooks/services/recently-viewed-handbooks.service';

@Component({
    selector: 'app-main-page',
    imports: [
        WelcomeCardComponent,
        ContinueReadingCardComponent,

        FavouritesCardComponent,
        PopularDirectoriesCardComponent
    ],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnInit {
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

    ngOnInit() {
        this.recentlyViewedHandbooksService.getValuesFromLocalStorage();

        this.recentlyViewedHandbooksService.getRecentlyViewedHandbooks();
    }
}
