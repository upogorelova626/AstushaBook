import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';

@Component({
    selector: 'app-continue-reading-card',
    imports: [TuiButton, TuiBadge, TuiAvatar],
    templateUrl: './continue-reading-card.component.html',
    styleUrl: './continue-reading-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContinueReadingCardComponent {
    protected readonly articleItems = [
        {
            avatar: '@tui.file-text',
            title: 'Angular Signals на практике',
            description:
                'Разбираем основы и практические примеры использования сигналов в Angular.',
            tag: 'Angular',
            lastUpdate: '2 дня назад'
        },
        {
            avatar: '@tui.settings',
            title: 'Настройка CI/CD',
            description:
                'Пошаговая настройка конвейера сборки и деплоя с помощью GitHub Actions.',
            tag: 'DevOps',
            lastUpdate: '5 дней назад'
        },
        {
            avatar: '@tui.container',
            title: 'Работа с Docker Compose',
            description:
                'Запуск нескольких сервисов и настройка локального окружения через Docker Compose.',
            tag: 'Docker',
            lastUpdate: 'Неделю назад'
        },
        {
            avatar: '@tui.code',
            title: 'Основы REST API',
            description:
                'Разбираем базовые принципы REST, методы запросов и структуру ответов.',
            tag: 'API',
            lastUpdate: '3 дня назад'
        }
    ];
}
