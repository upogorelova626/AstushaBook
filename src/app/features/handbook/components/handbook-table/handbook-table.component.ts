import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    Injector,
    input,
    signal,
    ViewChild
} from '@angular/core';
import {Handbook, HandbookRow} from '../../../../shared/interfaces';
import {TuiTable} from '@taiga-ui/addon-table';
import {TuiButton, TuiCheckbox} from '@taiga-ui/core';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {AddHandbookStringFormComponent} from '../add-handbook-string-form/add-handbook-string-form.component';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {finalize} from 'rxjs';

@Component({
    selector: 'app-handbook-table',
    imports: [TuiTable, TuiButton, TuiCheckbox],
    templateUrl: './handbook-table.component.html',
    styleUrl: './handbook-table.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookTableComponent {
    @ViewChild('loadMore')
    private loadMore!: ElementRef<HTMLElement>;
    private observer!: IntersectionObserver;

    readonly handbook = input<Handbook | null>(null);

    protected readonly rows = signal<HandbookRow[]>([]);
    // protected readonly values = signal<boolean | string | null | number[]>(null)
    protected readonly nextOffset = signal<number | null>(0);
    protected readonly isLoading = signal(false);

    private readonly sidebarService = inject(SideBarService);
    private readonly handbookService = inject(HandbookService);
    private readonly injector = inject(Injector);

    constructor() {
        effect(() => {
            this.isLoading.set(true);

            const handBookId = this.handbook()?.id;
            if (!handBookId) {
                return;
            }

            console.log(123);
            const payload = {offset: 0};

            this.handbookService
                .getHandbookRows(handBookId, payload)
                .pipe(finalize(() => this.isLoading.set(false)))
                .subscribe(result => this.rows.set(result.items));
        });
    }

    // ngAfterViewInit(): void {
    //     this.observer = new IntersectionObserver(entries => {
    //         const trigger = entries[0];

    //         if (trigger.isIntersecting) {
    //             this.handbookService.getHandbookRows();
    //         }
    //     });
    // }

    protected createAttribute(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.sidebarService
            .open$(
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
}
