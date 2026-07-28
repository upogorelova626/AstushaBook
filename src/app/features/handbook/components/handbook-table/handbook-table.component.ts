import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Injector,
    input,
    signal
} from '@angular/core';
import {Handbook} from '../../../../shared/interfaces';
import {TuiTable} from '@taiga-ui/addon-table';
import {TuiButton, TuiCheckbox} from '@taiga-ui/core';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {AddHandbookStringFormComponent} from '../add-handbook-string-form/add-handbook-string-form.component';

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

    private readonly sidebarService = inject(SideBarService);
    private readonly injector = inject(Injector);

    protected createAttribute(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.sidebarService
            .open$(
                new PolymorpheusComponent(
                    AddHandbookStringFormComponent,
                    this.injector
                ),
                {
                    overlay: true,
                    rounded: true,
                    offset: true
                },
                {handbook: this.handbook()}
            )
            .subscribe();
    }
}
