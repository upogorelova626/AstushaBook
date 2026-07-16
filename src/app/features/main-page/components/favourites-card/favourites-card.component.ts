import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-favourites-card',
    imports: [],
    templateUrl: './favourites-card.component.html',
    styleUrl: './favourites-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavouritesCardComponent {}
