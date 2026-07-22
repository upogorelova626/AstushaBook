import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiIcon} from '@taiga-ui/core';

@Component({
    selector: 'app-handbooks-guide-card',
    imports: [TuiButton, TuiIcon],
    templateUrl: './handbooks-guide-card.component.html',
    styleUrl: './handbooks-guide-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbooksGuideCardComponent {}
