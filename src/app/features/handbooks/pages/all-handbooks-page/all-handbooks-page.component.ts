import {ChangeDetectionStrategy, Component} from '@angular/core';
import {HandbooksInfoComponent} from '../../components/all-handbooks-components/handbooks-info/handbooks-info.component';
import {HandbooksToolbarComponent} from '../../components/all-handbooks-components/handbooks-toolbar/handbooks-toolbar.component';
import {HandbooksListComponent} from '../../components/all-handbooks-components/handbooks-list/handbooks-list.component';

@Component({
    selector: 'app-all-handbooks-page',
    imports: [
        HandbooksInfoComponent,
        HandbooksToolbarComponent,
        HandbooksListComponent
    ],
    templateUrl: './all-handbooks-page.component.html',
    styleUrl: './all-handbooks-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllHandbooksPageComponent {}
