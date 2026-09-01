import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiSkeleton} from '@taiga-ui/kit';
import {HandbooksListService} from '../../../services/handbooks-list.service';
import {HandbooksListItemComponent} from './handbooks-list-item/handbooks-list-item.component';

@Component({
    selector: 'app-handbooks-list',
    imports: [HandbooksListItemComponent, TuiSkeleton],
    templateUrl: './handbooks-list.component.html',
    styleUrl: './handbooks-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbooksListComponent {
    private readonly handbooksListService = inject(HandbooksListService);

    protected readonly isLoading = this.handbooksListService.isLoading;

    protected readonly handbookPreviews =
        this.handbooksListService.handbooksPreviews;
}
