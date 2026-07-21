import {inject, Injectable, signal} from '@angular/core';
import {
    CreateHandbookFormValues,
    HandbookEditingAccess,
    HandbookVisibility
} from '../../../shared/interfaces';
import {HandbookService} from '../../../shared/services/handbook.service';
import {TableStructureFormService} from './table-structure-form.service';

@Injectable({
    providedIn: 'root'
})
export class CreateHandbookFormService {
    private readonly handbookService = inject(HandbookService);

    private readonly tableStructureFormService = inject(
        TableStructureFormService
    );

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

        this.handbookService.createHandbook(payload).subscribe();
    }

    // export interface CreateHandbookRequest {
    //     name: string;
    //     description: string;
    //     systemName: string;
    //     tags: string[];
    //     columns: HandbookAttribute[];
    //     visibility: HandbookVisibility;
    //     editingPermission: HandbookEditingAccess;
    //     editorIds: string[];
    //     viewerIds: string[];
    // }
}
