import {Component, inject, input, output} from '@angular/core';
import {TuiButton, TuiHint} from '@taiga-ui/core';
import {Handbook, HandbookRow} from '../../../../shared/interfaces';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {AddHandbookStringFormComponent} from '../add-handbook-string-form/add-handbook-string-form.component';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

@Component({
    selector: 'app-edit-row-button',
    imports: [TuiButton, TuiHint],
    templateUrl: './edit-row-button.component.html',
    styleUrl: './edit-row-button.component.less'
})
export class EditRowButtonComponent {
    readonly handbook = input<Handbook | null>(null);
    readonly row = input<HandbookRow>();

    readonly updatedRow = output<HandbookRow>();

    private readonly sidebarService = inject(SideBarService);

    protected deleteRow() {
        return;
    }

    protected cloneRow() {
        return;
    }

    protected openEditRowDialog(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.sidebarService
            .open$<AddHandbookStringFormComponent, HandbookRow>(
                new PolymorpheusComponent(AddHandbookStringFormComponent),
                {
                    overlay: true,
                    rounded: true,
                    offset: true
                },
                {
                    handbook: this.handbook(),
                    editRow: this.row()
                }
            )
            .subscribe(updatedRow => {
                if (updatedRow) {
                    this.updatedRow.emit(updatedRow);
                }
            });
    }
}
