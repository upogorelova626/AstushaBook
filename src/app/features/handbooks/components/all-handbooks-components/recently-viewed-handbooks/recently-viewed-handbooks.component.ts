import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiExpand, TuiIcon} from '@taiga-ui/core';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';

@Component({
    selector: 'app-recently-viewed-handbooks',
    imports: [TuiButton, TuiIcon, TuiAvatar, TuiBadge, TuiExpand],
    templateUrl: './recently-viewed-handbooks.component.html',
    styleUrl: './recently-viewed-handbooks.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentlyViewedHandbooksComponent {
    protected expanded = false;

    protected readonly recentlyViewed = [
        {
            title: 'Основы REST API',
            tag: 'API',
            updatedAt: '2 дня назад',
            icon: '@tui.pyramid'
        },
        {
            title: 'Настройка CI/CD',
            tag: 'DevOps',
            updatedAt: '5 дней назад',
            icon: '@tui.settings'
        },
        {
            title: 'Работа с Docker Compose',
            tag: 'Docker',
            updatedAt: 'неделю назад',
            icon: '@tui.box'
        }
    ];
}
