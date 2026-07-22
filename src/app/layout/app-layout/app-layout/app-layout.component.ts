import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LayoutHeaderComponent} from '../../components/layout-header/layout-header.component';

@Component({
    selector: 'app-app-layout',
    imports: [RouterOutlet, LayoutHeaderComponent],
    templateUrl: './app-layout.component.html',
    styleUrl: './app-layout.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLayoutComponent {}
