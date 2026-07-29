import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    Injector,
    input,
    OnDestroy,
    signal,
    ViewChild
} from '@angular/core';
import {
    Handbook,
    HandbookColumnType,
    HandbookRow
} from '../../../../shared/interfaces';
import {TuiTable} from '@taiga-ui/addon-table';
import {TuiButton, TuiCheckbox} from '@taiga-ui/core';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {AddHandbookStringFormComponent} from '../add-handbook-string-form/add-handbook-string-form.component';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {finalize} from 'rxjs';
import {TuiSkeleton} from '@taiga-ui/kit';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-handbook-table',
    imports: [TuiTable, TuiButton, TuiCheckbox, TuiSkeleton, DatePipe],
    templateUrl: './handbook-table.component.html',
    styleUrl: './handbook-table.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookTableComponent implements AfterViewInit, OnDestroy {
    @ViewChild('loadMore')
    private loadMore!: ElementRef<HTMLElement>;
    private observer!: IntersectionObserver;

    readonly handbook = input<Handbook | null>(null);

    protected readonly rows = signal<HandbookRow[]>([]);
    protected readonly nextOffset = signal<number | null>(0);
    protected readonly isLoading = signal(false);

    private readonly sidebarService = inject(SideBarService);
    private readonly handbookService = inject(HandbookService);
    private readonly injector = inject(Injector);

    protected readonly HandbookColumnType = HandbookColumnType;

    constructor() {
        effect(() => {
            const handBookId = this.handbook()?.id;
            if (!handBookId) {
                return;
            }

            this.isLoading.set(true);

            this.handbookService
                .getHandbookRows(handBookId, {offset: 0})
                .pipe(finalize(() => this.isLoading.set(false)))
                .subscribe(result => {
                    this.rows.set(result.items);
                    this.nextOffset.set(result.nextOffset);
                });
        });
    }

    ngAfterViewInit() {
        this.observer = new IntersectionObserver(entries => {
            const trigger = entries[0];

            if (trigger.isIntersecting) {
                const handBookId = this.handbook()?.id;
                const offset = this.nextOffset();

                if (!handBookId || offset === null) {
                    return;
                }

                const payload = {offset: this.nextOffset()};

                this.handbookService
                    .getHandbookRows(handBookId, payload)
                    .subscribe(result => {
                        this.rows.update(currentRows => [
                            ...currentRows,
                            ...result.items
                        ]);
                        this.nextOffset.set(result.nextOffset);
                    });
            }
        });

        this.observer.observe(this.loadMore.nativeElement);
    }

    ngOnDestroy() {
        this.observer.disconnect();
    }

    protected createAttribute(event: MouseEvent) {
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
            .subscribe(row => this.rows.update(rows => [...rows, row]));
    }

    protected getDateValue(
        value: string | number | boolean | null
    ): string | number | null {
        return typeof value === 'string' || typeof value === 'number'
            ? value
            : null;
    }
}
