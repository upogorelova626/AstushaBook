import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {Handbook} from '../../../../shared/interfaces';
import {TuiTable} from '@taiga-ui/addon-table';

@Component({
    selector: 'app-handbook-table',
    imports: [TuiTable],
    templateUrl: './handbook-table.component.html',
    styleUrl: './handbook-table.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookTableComponent {
    readonly handbook = input<Handbook | null>(null);
}
