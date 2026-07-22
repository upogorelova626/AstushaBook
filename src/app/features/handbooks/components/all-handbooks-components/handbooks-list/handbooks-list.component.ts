import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';

@Component({
    selector: 'app-handbooks-list',
    imports: [TuiButton, TuiAvatar, TuiBadge],
    templateUrl: './handbooks-list.component.html',
    styleUrl: './handbooks-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbooksListComponent {}
