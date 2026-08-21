import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiNotificationService} from '@taiga-ui/core';
import {
    TuiAvatar,
    TuiBadge,
    tuiLikeOptionsProvider,
    TuiSkeleton
} from '@taiga-ui/kit';
import {HandbooksListService} from '../../../services/handbooks-list.service';
import {Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {HandbookPreview} from '../../../../../shared/interfaces';
import {HandbookService} from '../../../../../shared/services/handbook.service';
import {catchError, EMPTY, tap} from 'rxjs';

@Component({
    selector: 'app-handbooks-list',
    imports: [TuiButton, TuiAvatar, TuiBadge, TuiSkeleton, ReactiveFormsModule],
    templateUrl: './handbooks-list.component.html',
    styleUrl: './handbooks-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        tuiLikeOptionsProvider({
            icons: {unchecked: '@tui.star', checked: '@tui.star-filled'}
        })
    ]
})
export class HandbooksListComponent {
    private readonly handbooksListService = inject(HandbooksListService);
    private readonly handbookService = inject(HandbookService);
    private readonly alerts = inject(TuiNotificationService);
    private readonly router = inject(Router);

    protected readonly isLoading = this.handbooksListService.isLoading;

    protected readonly handbookPreviews =
        this.handbooksListService.handbooksPreviews;

    protected openHandbook(id: string) {
        this.router.navigate(['astusha', 'handbooks', id]);
    }

    protected changeHandbookStatus(handbook: HandbookPreview) {
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
            .subscribe(response =>
                this.handbooksListService.updateHandbookFavouriteStatus(
                    handbookId,
                    response.isFavorite
                )
            );
    }
}
