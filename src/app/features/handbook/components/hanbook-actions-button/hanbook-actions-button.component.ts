import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Injector,
    signal
} from '@angular/core';
import {TuiActiveZone} from '@taiga-ui/cdk/directives/active-zone';
import {TuiObscured} from '@taiga-ui/cdk/directives/obscured';
import {
    TuiButton,
    TuiDataList,
    TuiDialogService,
    TuiDropdown,
    TuiNotificationService
} from '@taiga-ui/core';
import {TuiChevron} from '@taiga-ui/kit';
import {Handbook, HandbookRow} from '../../../../shared/interfaces';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {catchError, delay, EMPTY, tap} from 'rxjs';
import {Router} from '@angular/router';
import {AddHandbookStringFormComponent} from '../add-handbook-string-form/add-handbook-string-form.component';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {EditHanbdookDesccriptionDialogComponent} from '../edit-hanbdook-desccription-dialog/edit-hanbdook-desccription-dialog.component';
import {EditHandbookAttributesComponent} from '../edit-handbook-attributes/edit-handbook-attributes.component';
import {HandbookInfoService} from '../../services/handbook-info.service';

interface ExampleAction {
    readonly icon: string;
    readonly title: string;
    readonly action: () => void;
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
    styleUrl: './hanbook-actions-button.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanbookActionsButtonComponent {
    private readonly handbooksService = inject(HandbookService);
    private readonly sidebarService = inject(SideBarService);
    private readonly handbookInfoService = inject(HandbookInfoService);

    private readonly alerts = inject(TuiNotificationService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly router = inject(Router);

    private readonly injector = inject(Injector);

    protected readonly open = signal(false);

    protected readonly handbook = this.handbookInfoService.handbook;

    protected readonly editingActions: readonly ExampleAction[] = [
        {
            icon: '@tui.scroll-text',
            title: 'Описание',
            action: () => this.openEditDescriptionDialog()
        },
        {
            icon: '@tui.table-of-contents',
            title: 'Атрибуты',
            action: () => this.editAttributes()
        },
        {
            icon: '@tui.lock-keyhole',
            title: 'Доступы',
            action: () => {
                return;
            }
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

    protected openEditDescriptionDialog() {
        const handbook = this.handbook();

        if (!handbook) {
            return;
        }

        this.dialogs
            .open<Handbook>(
                new PolymorpheusComponent(
                    EditHanbdookDesccriptionDialogComponent,
                    this.injector
                ),
                {
                    label: 'Редактирование описания',
                    size: 'm',
                    data: handbook
                }
            )
            .subscribe(updatedHandbook => this.handbook.set(updatedHandbook));
    }

    protected createRow(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.sidebarService
            .open$<AddHandbookStringFormComponent, HandbookRow>(
                new PolymorpheusComponent(
                    AddHandbookStringFormComponent,
                    this.injector
                ),
                {
                    overlay: true,
                    rounded: true,
                    offset: true
                },
                {handbook: this.handbook()}
            )
            .subscribe();
    }

    protected editAttributes() {
        this.sidebarService
            .open$<EditHandbookAttributesComponent, Handbook>(
                new PolymorpheusComponent(
                    EditHandbookAttributesComponent,
                    this.injector
                ),
                {
                    overlay: true,
                    rounded: true,
                    offset: true
                },
                {handbook: this.handbook()}
            )
            .subscribe(updatedHandbook => {
                if (updatedHandbook) {
                    this.handbook.set(updatedHandbook);
                }
            });
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
                delay(500),
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
}
