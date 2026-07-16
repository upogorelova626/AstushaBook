import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton, TuiIcon} from '@taiga-ui/core';

@Component({
    selector: 'app-popular-directories-card',
    imports: [TuiIcon, TuiButton],
    templateUrl: './popular-directories-card.component.html',
    styleUrl: './popular-directories-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopularDirectoriesCardComponent {
    protected readonly handbookItems = [
        {
            name: 'HTTP-коды',
            count: '128 записей'
        },
        {
            name: 'Команды Git',
            count: '42 записи'
        },
        {
            name: 'Окружения проектов',
            count: '36 записей'
        }
    ];
}
