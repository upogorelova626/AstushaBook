import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {Handbook} from '../../../../shared/interfaces';
import {TuiTable} from '@taiga-ui/addon-table';
import {TuiButton, TuiCheckbox} from '@taiga-ui/core';

@Component({
    selector: 'app-handbook-table',
    imports: [TuiTable, TuiButton, TuiCheckbox],
    templateUrl: './handbook-table.component.html',
    styleUrl: './handbook-table.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookTableComponent {
    readonly handbook = input<Handbook | null>(null);

    protected readonly strings = signal([]);
}
