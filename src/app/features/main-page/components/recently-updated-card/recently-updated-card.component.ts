import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';

@Component({
    selector: 'app-recently-updated-card',
    imports: [TuiButton, TuiAvatar],
    templateUrl: './recently-updated-card.component.html',
    styleUrl: './recently-updated-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentlyUpdatedCardComponent {
    protected readonly recentlyUpdatedItems = [
        {
            name: 'Оптимизация изображений в Angular',
            updatedAt: 'Обновлено 2 недели назад'
        },
        {
            name: 'Лучшие практики TypeScript',
            updatedAt: 'Обновлено 2 недели назад'
        },
        {
            name: 'Работа с Docker Compose',
            updatedAt: 'Обновлено неделю назад'
        },
        {
            name: 'Настройка CI/CD',
            updatedAt: 'Обновлено 5 дней назад'
        },
        {
            name: 'Angular Signals на практике',
            updatedAt: 'Обновлено 2 дня назад'
        }
    ];
}
