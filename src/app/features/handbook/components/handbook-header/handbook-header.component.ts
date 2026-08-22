import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject
} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {HanbookActionsButtonComponent} from '../hanbook-actions-button/hanbook-actions-button.component';
import {EditCellsButtonsComponent} from '../edit-cells-buttons/edit-cells-buttons.component';
import {UserService} from '../../../auth/services/user.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {AddHandbookRowButtonComponent} from '../add-handbook-row-button/add-handbook-row-button.component';
import {HandbookInfoService} from '../../services/handbook-info.service';
import {Location} from '@angular/common';

@Component({
    selector: 'app-handbook-header',
    imports: [
        TuiButton,
        HanbookActionsButtonComponent,
        EditCellsButtonsComponent,
        AddHandbookRowButtonComponent
    ],
    templateUrl: './handbook-header.component.html',
    styleUrl: './handbook-header.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookHeaderComponent {
    private readonly userService = inject(UserService);
    private readonly handbookInfoService = inject(HandbookInfoService);

    private readonly location = inject(Location);

    protected readonly currentUser = toSignal(this.userService.currentUser$);

    protected readonly handbook = this.handbookInfoService.handbook;

    protected readonly canEditHandbook = computed(() => {
        const currentUserId = this.currentUser()?.id;

        return !!this.handbook()?.editors.some(
            editor => editor.userId === currentUserId
        );
    });

    protected goBack() {
        this.location.back();
    }
}
