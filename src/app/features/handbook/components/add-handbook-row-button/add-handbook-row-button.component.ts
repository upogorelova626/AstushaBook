import {Component, inject, output} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {AddHandbookStringFormComponent} from '../add-handbook-string-form/add-handbook-string-form.component';
import {HandbookRow} from '../../../../shared/interfaces';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {HandbookInfoService} from '../../services/handbook-info.service';

@Component({
    selector: 'app-add-handbook-row-button',
    imports: [TuiButton],
    templateUrl: './add-handbook-row-button.component.html',
    styleUrl: './add-handbook-row-button.component.less'
})
export class AddHandbookRowButtonComponent {
    private readonly sidebarService = inject(SideBarService);
    private readonly handbookInfoService = inject(HandbookInfoService);

    protected readonly handbook = this.handbookInfoService.handbook;

    readonly newRow = output<HandbookRow[]>();

    protected createAttribute(event: MouseEvent) {
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
                    handbook: this.handbook()
                }
            )
            .subscribe(row => {
                if (!row) {
                    return;
                }

                this.newRow.emit([row]);
            });
    }
}
