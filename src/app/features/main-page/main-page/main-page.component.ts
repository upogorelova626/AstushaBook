import {ChangeDetectionStrategy, Component} from '@angular/core';
import {WelcomeCardComponent} from '../components/welcome-card/welcome-card.component';
import {ContinueReadingCardComponent} from '../components/continue-reading-card/continue-reading-card.component';
import {PopularDirectoriesCardComponent} from '../components/popular-directories-card/popular-directories-card.component';
import {RecentlyUpdatedCardComponent} from '../components/recently-updated-card/recently-updated-card.component';
import {QuickActionsCardComponent} from '../components/quick-actions-card/quick-actions-card.component';
import {FavouritesCardComponent} from '../components/favourites-card/favourites-card.component';

@Component({
    selector: 'app-main-page',
    imports: [
        WelcomeCardComponent,
        ContinueReadingCardComponent,
        RecentlyUpdatedCardComponent,
        QuickActionsCardComponent,
        FavouritesCardComponent,
        PopularDirectoriesCardComponent
    ],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent {}
