import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiAvatar} from '@taiga-ui/kit';

@Component({
    selector: 'app-handbooks-info',
    imports: [TuiAvatar],
    templateUrl: './handbooks-info.component.html',
    styleUrl: './handbooks-info.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbooksInfoComponent {
    protected readonly cardItems = [
        {icon: '@tui.sheet', title: 'Всего', count: '24'},
        {icon: '@tui.user', title: 'Мои', count: '6'},
        {icon: '@tui.shield-check', title: 'Доступные', count: '18'}
    ];
}
