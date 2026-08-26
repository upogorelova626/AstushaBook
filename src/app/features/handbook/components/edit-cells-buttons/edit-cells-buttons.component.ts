import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {HandbookInfoService} from '../../services/handbook-info.service';
import {TuiButton} from '@taiga-ui/core';

@Component({
    selector: 'app-edit-cells-buttons',
    imports: [TuiButton],
    templateUrl: './edit-cells-buttons.component.html',
    styleUrl: './edit-cells-buttons.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCellsButtonsComponent {
    private readonly handbookInfoService = inject(HandbookInfoService);

    protected readonly handbook = this.handbookInfoService.handbook;
    protected readonly isEditing = this.handbookInfoService.isEditing;

    protected startEditing() {
        this.handbookInfoService.startEditing();
    }

    protected save() {
        const handbookId = this.handbook()?.id;

        if (!handbookId) {
            return;
        }

        this.handbookInfoService.editHandbookRows(handbookId);
    }

    protected cancel() {
        this.handbookInfoService.cancelEditing();
    }
}
