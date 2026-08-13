import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {Handbook} from '../../../../shared/interfaces';
import {RouterLink} from '@angular/router';
import {HanbookActionsButtonComponent} from '../hanbook-actions-button/hanbook-actions-button.component';
import {EditCellsButtonsComponent} from '../edit-cells-buttons/edit-cells-buttons.component';

@Component({
    selector: 'app-handbook-header',
    imports: [
        TuiButton,
        RouterLink,
        HanbookActionsButtonComponent,
        EditCellsButtonsComponent
    ],
    templateUrl: './handbook-header.component.html',
    styleUrl: './handbook-header.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookHeaderComponent {
    readonly handbook = model<Handbook | null>(null);
}
