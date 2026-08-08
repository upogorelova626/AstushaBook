import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {HandbookHeaderComponent} from '../../components/handbook-header/handbook-header.component';
import {HandbookTableComponent} from '../../components/handbook-table/handbook-table.component';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {Handbook} from '../../../../shared/interfaces';
import {ActivatedRoute} from '@angular/router';
import {catchError, EMPTY, finalize} from 'rxjs';
import {TuiSkeleton} from '@taiga-ui/kit';
import {SidebarHostComponent} from '../../../handbooks/components/host-drawer/sidebar-host.component';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {HandbookTableService} from '../../services/handbook-table.service';

@Component({
    selector: 'app-handbook-page',
    imports: [
        HandbookHeaderComponent,
        HandbookTableComponent,
        TuiSkeleton,
        SidebarHostComponent
    ],
    templateUrl: './handbook-page.component.html',
    styleUrl: './handbook-page.component.less',
    providers: [SideBarService, HandbookTableService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookPageComponent implements OnInit {
    private readonly handbookService = inject(HandbookService);
    private readonly handbookTableService = inject(HandbookTableService);
    private readonly route = inject(ActivatedRoute);

    protected readonly isLoading = signal(false);
    protected readonly handbook = signal<Handbook | null>(null);

    ngOnInit() {
        const handbookId = this.route.snapshot.paramMap.get('id');

        if (!handbookId) {
            return;
        }

        this.isLoading.set(true);

        this.handbookTableService.getHandbookRows(handbookId);

        this.handbookService
            .getHandbook(handbookId)
            .pipe(
                catchError(() => {
                    return EMPTY;
                }),
                finalize(() => {
                    this.isLoading.set(false);
                })
            )
            .subscribe(handbook => {
                this.handbook.set(handbook);
            });
    }
}
