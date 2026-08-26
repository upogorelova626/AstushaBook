import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit
} from '@angular/core';
import {HandbookHeaderComponent} from '../../components/handbook-header/handbook-header.component';
import {HandbookTableComponent} from '../../components/handbook-table/handbook-table.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TuiSkeleton} from '@taiga-ui/kit';
import {SidebarHostComponent} from '../../../handbooks/components/host-drawer/sidebar-host.component';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {HandbookInfoService} from '../../services/handbook-info.service';
import {RecentlyViewedHandbooksService} from '../../../handbooks/services/recently-viewed-handbooks.service';

@Component({
    selector: 'app-handbook-page',
    imports: [
        HandbookHeaderComponent,
        HandbookTableComponent,
        SidebarHostComponent,
        TuiSkeleton
    ],
    templateUrl: './handbook-page.component.html',
    styleUrl: './handbook-page.component.less',
    providers: [SideBarService, HandbookInfoService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookPageComponent implements OnInit {
    private readonly handbookInfoService = inject(HandbookInfoService);
    private readonly recentlyViewedHandbooksService = inject(
        RecentlyViewedHandbooksService
    );

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected readonly isLoading = this.handbookInfoService.isLoading;

    ngOnInit() {
        const handbookId = this.route.snapshot.paramMap.get('id');

        if (!handbookId || handbookId === 'null') {
            this.router.navigate(['/404']);
            return;
        }

        this.handbookInfoService.getHandbookRows(handbookId);
        this.handbookInfoService.getHandbook(handbookId);

        this.recentlyViewedHandbooksService.addHandbookIdToLocalStorage(
            handbookId
        );
    }
}
