import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Injector
} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiBadge} from '@taiga-ui/kit';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {HandbookAttribute} from '../../../../../shared/interfaces';
import {TableStructureFormService} from '../../../services/table-structure-form.service';
import {SideBarService} from '../../host-drawer/sidebar.service';
import {AttributeFormComponent} from '../attribute-form/attribute-form.component';

@Component({
    selector: 'app-table-structure',
    imports: [TuiButton, TuiBadge],
    templateUrl: './table-structure.component.html',
    styleUrl: './table-structure.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableStructureComponent {
    private readonly sidebarService = inject(SideBarService);
    private readonly injector = inject(Injector);

    protected readonly tableStructureFormService = inject(
        TableStructureFormService
    );

    protected createAttribute(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.sidebarService
            .open$<AttributeFormComponent, HandbookAttribute | null>(
                new PolymorpheusComponent(
                    AttributeFormComponent,
                    this.injector
                ),
                {
                    overlay: true,
                    rounded: true,
                    offset: true
                }
            )
            .subscribe(result => {
                if (result) {
                    this.tableStructureFormService.add(result);

                    console.log(result);
                }
            });
    }

    protected editAttribute(index: number, event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const attribute =
            this.tableStructureFormService.tableStuctureValues()[index];

        this.sidebarService
            .open$<AttributeFormComponent, HandbookAttribute | null>(
                new PolymorpheusComponent(
                    AttributeFormComponent,
                    this.injector
                ),
                {
                    overlay: true,
                    rounded: true,
                    offset: true
                },
                {
                    data: attribute
                }
            )
            .subscribe(result => {
                if (result) {
                    this.tableStructureFormService.update(index, result);
                }
            });
    }

    protected deleteColumn(index: number) {
        this.tableStructureFormService.delete(index);
    }
}
