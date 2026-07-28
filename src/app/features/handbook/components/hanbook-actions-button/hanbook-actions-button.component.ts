import {Component, signal} from '@angular/core';
import {TuiActiveZone} from '@taiga-ui/cdk/directives/active-zone';
import {TuiObscured} from '@taiga-ui/cdk/directives/obscured';
import {TuiButton, TuiDataList, TuiDropdown} from '@taiga-ui/core';
import {TuiChevron} from '@taiga-ui/kit';

interface ExampleAction {
    readonly icon: string;
    readonly title: string;
}

@Component({
    selector: 'app-hanbook-actions-button',
    imports: [
        TuiButton,
        TuiChevron,
        TuiDataList,
        TuiActiveZone,
        TuiObscured,
        TuiDropdown
    ],
    templateUrl: './hanbook-actions-button.component.html',
    styleUrl: './hanbook-actions-button.component.less'
})
export class HanbookActionsButtonComponent {
    protected readonly open = signal(false);
    protected readonly selected = signal<ExampleAction | null>(null);

    protected readonly editingActions = [
        {icon: '@tui.scroll-text', title: 'Описание'},
        {icon: '@tui.table-of-contents', title: 'Атрибуты'},
        {icon: '@tui.lock-keyhole', title: 'Доступы'}
    ];

    protected readonly anotherActions = [
        {icon: '@tui.plus', title: 'Добавить строку'},
        {icon: '@tui.trash-2', title: 'Удалить справочник'}
    ];

    protected onClick() {
        this.open.update(open => !open);
    }

    protected onObscured(obscured: boolean): void {
        if (obscured) {
            this.open.set(false);
        }
    }

    protected onActiveZone(active: boolean): void {
        if (!active) {
            this.open.set(false);
        }
    }

    protected onSelect(action: ExampleAction): void {
        this.selected.set(action);
        this.open.set(false);
    }
}
