import {inject, Injectable, signal} from '@angular/core';
import {
    CreateHandbookFormValues,
    HandbookEditingAccess,
    HandbookVisibility
} from '../../../shared/interfaces';
import {HandbookService} from '../../../shared/services/handbook.service';
import {TableStructureFormService} from './table-structure-form.service';
import {TuiNotificationService} from '@taiga-ui/core';
import {Router} from '@angular/router';
import {catchError, EMPTY, tap} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CreateHandbookFormService {
    private readonly handbookService = inject(HandbookService);

    private readonly tableStructureFormService = inject(
        TableStructureFormService
    );

    private readonly alerts = inject(TuiNotificationService);
    private readonly router = inject(Router);

    readonly values = signal<Partial<CreateHandbookFormValues>>({});

    update(newWalues: Partial<CreateHandbookFormValues>) {
        this.values.update(currentValues => ({
            ...currentValues,
            ...newWalues
        }));
    }

    createHandbook() {
        const values = this.values();
        const tableStructure =
            this.tableStructureFormService.tableStuctureValues();

        const payload = {
            name: values.name ?? '',
            description: values.description ?? '',
            systemName: values.systemName ?? '',
            tags: values.tags ?? [],
            columns: tableStructure ?? [],
            visibility: values.visibility ?? HandbookVisibility.Public,
            editingPermission:
                values.editingPermission ?? HandbookEditingAccess.OwnerOnly,
            editorIds: values.editorUsers?.map(user => user.id) ?? [],
            viewerIds: values.viewerUsers?.map(user => user.id) ?? []
        };

        this.handbookService
            .createHandbook(payload)
            .pipe(
                tap(() =>
                    this.alerts
                        .open('Справочник успешно создан', {
                            label: 'Готово',
                            appearance: 'positive'
                        })
                        .subscribe()
                ),
                catchError(() => {
                    this.alerts
                        .open('Не создать справочник. Попробуйте еще раз', {
                            label: 'Ошибка',
                            appearance: 'negative'
                        })
                        .subscribe();
                    return EMPTY;
                })
            )
            .subscribe(handbook => {
                this.router.navigate(
                    ['astusha', 'handbooks', 'create', 'success'],
                    {queryParams: {id: handbook.id, name: handbook.name}}
                );

                this.tableStructureFormService.tableStuctureValues.set([]);

                this.values.set({});
            });
    }
}
