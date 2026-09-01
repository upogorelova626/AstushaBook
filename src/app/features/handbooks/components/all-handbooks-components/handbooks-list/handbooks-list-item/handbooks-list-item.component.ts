import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {HandbookPreview} from '../../../../../../shared/interfaces';
import {catchError, EMPTY, tap} from 'rxjs';
import {HandbooksListService} from '../../../../services/handbooks-list.service';
import {HandbookService} from '../../../../../../shared/services/handbook.service';
import {TuiButton, TuiExpand, TuiNotificationService} from '@taiga-ui/core';
import {Router, RouterLink} from '@angular/router';
import {TuiAvatar, TuiBadge, TuiChevron} from '@taiga-ui/kit';
import {DatePipe} from '@angular/common';
import {RecentlyViewedHandbooksService} from '../../../../services/recently-viewed-handbooks.service';

@Component({
    selector: 'app-handbooks-list-item',
    imports: [
        TuiButton,
        TuiAvatar,
        TuiBadge,
        TuiExpand,
        TuiChevron,
        DatePipe,
        RouterLink
    ],
    templateUrl: './handbooks-list-item.component.html',
    styleUrl: './handbooks-list-item.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbooksListItemComponent {
    private readonly handbooksListService = inject(HandbooksListService);
    private readonly recentlyViewedHandbooksService = inject(
        RecentlyViewedHandbooksService
    );
    private readonly handbookService = inject(HandbookService);
    private readonly alerts = inject(TuiNotificationService);
    private readonly router = inject(Router);

    protected expanded = false;

    readonly handbook = input.required<HandbookPreview>();
    readonly isHandbooksList = input.required();

    protected changeHandbookStatus(
        event: MouseEvent,
        handbook: HandbookPreview
    ) {
        event.preventDefault();
        event.stopPropagation();

        const handbookId = handbook.id;

        const payload = {isFavorite: !handbook.isFavorite};

        this.handbookService
            .editFavouriteStatus(handbookId, payload)
            .pipe(
                tap(() =>
                    this.alerts
                        .open(
                            !handbook.isFavorite
                                ? 'Справочник успешно добавлен в избранное'
                                : 'Справочник удалён из избранного',
                            {
                                label: 'Готово',
                                appearance: 'positive'
                            }
                        )
                        .subscribe()
                ),
                catchError(() => {
                    this.alerts
                        .open('Не удалось добавить справочник в избранные', {
                            label: 'Ошибка',
                            appearance: 'negative'
                        })
                        .subscribe();
                    return EMPTY;
                })
            )
            .subscribe(response => {
                this.handbooksListService.updateHandbookFavouriteStatus(
                    handbookId,
                    response.isFavorite
                );
                this.handbooksListService.getHandbooksFiltersCount();

                this.recentlyViewedHandbooksService.getRecentlyViewedHandbooks();
            });
    }

    protected openHandbook(id: string) {
        this.router.navigate(['astusha', 'handbooks', id]);
    }

    protected toggleExpanded(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.expanded = !this.expanded;
    }
}
