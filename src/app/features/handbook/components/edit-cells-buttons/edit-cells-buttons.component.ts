import {Component, inject, input} from '@angular/core';
import {HandbookTableService} from '../../services/handbook-table.service';
import {TuiButton} from '@taiga-ui/core';
import {Handbook} from '../../../../shared/interfaces';

@Component({
    selector: 'app-edit-cells-buttons',
    imports: [TuiButton],
    templateUrl: './edit-cells-buttons.component.html',
    styleUrl: './edit-cells-buttons.component.less'
})
export class EditCellsButtonsComponent {
    readonly handbook = input<Handbook | null>(null);

    private readonly handbookTableService = inject(HandbookTableService);

    protected readonly isEditing = this.handbookTableService.isEditing;

    protected startEditing() {
        this.handbookTableService.startEditing();
    }

    protected save() {
        const handbookId = this.handbook()?.id;

        if (!handbookId) {
            return;
        }

        this.handbookTableService.editHandbookRows(handbookId);
        this.isEditing.set(false);
    }

    protected cancel() {
        this.handbookTableService.cancelEditing();
    }
}
