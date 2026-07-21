import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiButton, TuiIcon} from '@taiga-ui/core';

@Component({
    selector: 'app-layout-sidebar',
    imports: [TuiIcon, TuiButton, RouterLink],
    templateUrl: './layout-sidebar.component.html',
    styleUrl: './layout-sidebar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSidebarComponent {
    protected logout() {
        return null;
    }

    protected openHelpDialog() {
        return null;
    }

    protected readonly sidebarItems = [
        {icon: '@tui.house', link: ['/astusha/overview'], text: 'Главная'},
        {
            icon: '@tui.sheet',
            link: ['/astusha/handbooks/all'],
            text: 'Справочники'
        },
        {icon: '@tui.star', link: ['/astusha/favourites'], text: 'Избранное'},
        {icon: '@tui.user', link: ['/astusha/my'], text: 'Мои материалы'}
    ];
}
