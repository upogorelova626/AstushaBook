import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';
import {HandbooksListService} from '../../../services/handbooks-list.service';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

@Component({
    selector: 'app-handbooks-list',
    imports: [TuiButton, TuiAvatar, TuiBadge, DatePipe],
    templateUrl: './handbooks-list.component.html',
    styleUrl: './handbooks-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbooksListComponent {
    private readonly handbooksListService = inject(HandbooksListService);
    private readonly router = inject(Router);

    protected readonly handbookPreviews =
        this.handbooksListService.handbooksPreviews;

    protected openHandbook(id: string) {
        this.router.navigate(['astusha', 'handbooks', id]);
    }
}
