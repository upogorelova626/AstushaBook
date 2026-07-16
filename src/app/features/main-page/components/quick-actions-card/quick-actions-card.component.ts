import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';

@Component({
    selector: 'app-quick-actions-card',
    imports: [TuiButton],
    templateUrl: './quick-actions-card.component.html',
    styleUrl: './quick-actions-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickActionsCardComponent {
    protected readonly quickActionsButtons = [
        {
            icon: '@tui.scroll-text',
            title: 'Создать статью',
            action: this.createArticle()
        },
        {
            icon: '@tui.sheet',
            title: 'Создать справочник',
            action: this.createHandbook()
        },
        {
            icon: '@tui.library-big',
            title: 'Открыть библиотеку',
            action: this.openLibrary()
        },
        {icon: '@tui.user', title: 'Мои материалы', action: this.openMy}
    ];

    protected createArticle() {
        return;
    }

    protected createHandbook() {
        return;
    }

    protected openLibrary() {
        return;
    }

    protected openMy() {
        return;
    }
}
