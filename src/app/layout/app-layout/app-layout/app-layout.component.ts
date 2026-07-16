import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LayoutHeaderComponent} from '../../components/layout-header/layout-header.component';
import {LayoutSidebarComponent} from '../../components/layout-sidebar/layout-sidebar.component';

@Component({
    selector: 'app-app-layout',
    imports: [RouterOutlet, LayoutHeaderComponent, LayoutSidebarComponent],
    templateUrl: './app-layout.component.html',
    styleUrl: './app-layout.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLayoutComponent {}
