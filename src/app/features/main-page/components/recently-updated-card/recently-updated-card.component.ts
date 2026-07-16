import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-recently-updated-card',
    imports: [],
    templateUrl: './recently-updated-card.component.html',
    styleUrl: './recently-updated-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentlyUpdatedCardComponent {}
