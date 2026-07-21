import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {SidebarOptions, SideBarService} from './sidebar.service';
import {AsyncPipe} from '@angular/common';
import {PolymorpheusOutlet} from '@taiga-ui/polymorpheus';
import {TuiDrawer} from '@taiga-ui/kit';
import {BarItem} from './base-bar.service';

@Component({
    standalone: true,
    selector: 'app-sidebar-host',
    templateUrl: './sidebar-host.component.html',
    styleUrl: './sidebar-host.component.less',
    imports: [AsyncPipe, PolymorpheusOutlet, TuiDrawer],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarHostComponent {
    private readonly sidebarService = inject(SideBarService);

    protected readonly items$ = this.sidebarService.items$;

    onClickOutside(item: BarItem<unknown, SidebarOptions, unknown>) {
        if (item.options?.closeOnClickOutside) {
            item.context.complete();
        }
    }
}
