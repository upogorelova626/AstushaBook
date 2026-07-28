import {Component, inject, input, signal} from '@angular/core';
import {TuiActiveZone} from '@taiga-ui/cdk/directives/active-zone';
import {TuiObscured} from '@taiga-ui/cdk/directives/obscured';
import {
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiNotificationService
} from '@taiga-ui/core';
import {TuiChevron} from '@taiga-ui/kit';
import {Handbook} from '../../../../shared/interfaces';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {catchError, delay, EMPTY, tap} from 'rxjs';
import {Router} from '@angular/router';

interface ExampleAction {
    readonly icon: string;
    readonly title: string;
    action: () => void;
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
    readonly handbook = input<Handbook | null>(null);

    private readonly handbooksService = inject(HandbookService);
    private readonly alerts = inject(TuiNotificationService);
    private readonly router = inject(Router);

    protected readonly open = signal(false);
    protected readonly selected = signal<ExampleAction | null>(null);

    protected readonly editingActions = [
        {icon: '@tui.scroll-text', title: 'Описание'},
        {icon: '@tui.table-of-contents', title: 'Атрибуты'},
        {icon: '@tui.lock-keyhole', title: 'Доступы'}
    ];

    protected readonly anotherActions = [
        {
            icon: '@tui.plus',
            title: 'Добавить строку',
            action: () => this.addRow
        },
        {
            icon: '@tui.trash-2',
            title: 'Удалить справочник',
            action: () => this.deleteHandbook()
        }
    ];

    protected onClick() {
        this.open.update(open => !open);
    }

    protected onObscured(obscured: boolean) {
        if (obscured) {
            this.open.set(false);
        }
    }

    protected onActiveZone(active: boolean) {
        if (!active) {
            this.open.set(false);
        }
    }

    protected onSelect(action: ExampleAction) {
        this.selected.set(action);
        this.open.set(false);
    }

    protected deleteHandbook() {
        const id = this.handbook()?.id;
        if (!id) {
            return;
        }
        this.handbooksService
            .deleteHandbook(id)
            .pipe(
                tap(() => {
                    this.alerts
                        .open('Справочник успешно удалён', {
                            label: 'Готово',
                            appearance: 'positive'
                        })
                        .subscribe();
                }),
                delay(1000),
                tap(() => {
                    this.router.navigate(['astusha', 'handbooks', 'all']);
                }),
                catchError(() => {
                    this.alerts
                        .open('Не удалось удалить справочник', {
                            label: 'Ошибка',
                            appearance: 'negative'
                        })
                        .subscribe();

                    return EMPTY;
                })
            )
            .subscribe();
    }
    protected addRow() {
        return;
    }
}
