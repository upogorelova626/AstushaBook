import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiGroup, TuiRadio} from '@taiga-ui/core';
import {TuiBlock} from '@taiga-ui/kit';

import {
    AstushaUserPreview,
    HandbookEditingAccess,
    HandbookVisibility
} from '../../../../../shared/interfaces';
import {CreateHandbookFormService} from '../../../services/create-handbook-form.service';
import {SearchUsersComponent} from '../search-users/search-users.component';

@Component({
    selector: 'app-settings',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiRadio,
        TuiGroup,
        TuiBlock,
        SearchUsersComponent
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
    private readonly createHandbookFormService = inject(
        CreateHandbookFormService
    );

    protected readonly values = this.createHandbookFormService.values;

    protected readonly HandbookEditingAccess = HandbookEditingAccess;
    protected readonly HandbookVisibility = HandbookVisibility;

    protected readonly editingForm = new FormGroup({
        value: new FormControl(
            this.values().editingPermission ?? HandbookEditingAccess.OwnerOnly,
            {nonNullable: true}
        )
    });

    protected readonly visibilityForm = new FormGroup({
        value: new FormControl(
            this.values().visibility ?? HandbookVisibility.Public,
            {nonNullable: true}
        )
    });

    constructor() {
        this.editingForm.controls.value.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(editingPermission => {
                this.createHandbookFormService.update({
                    editingPermission
                });

                if (
                    editingPermission !== HandbookEditingAccess.SelectedEditors
                ) {
                    this.createHandbookFormService.update({
                        editorUsers: []
                    });
                }

                if (
                    editingPermission !== HandbookEditingAccess.OwnerOnly &&
                    this.visibilityForm.controls.value.value ===
                        HandbookVisibility.OwnerOnly
                ) {
                    this.visibilityForm.controls.value.setValue(
                        HandbookVisibility.Public
                    );
                }
            });

        this.visibilityForm.controls.value.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(visibility => {
                this.createHandbookFormService.update({
                    visibility
                });

                if (visibility !== HandbookVisibility.SelectedUsers) {
                    this.createHandbookFormService.update({
                        viewerUsers: []
                    });
                }
            });
    }

    protected addUsersToRedactors(user: AstushaUserPreview) {
        const editorUsers = this.values().editorUsers ?? [];
        const viewerUsers = this.values().viewerUsers ?? [];

        if (editorUsers.some(editor => editor.id === user.id)) {
            return;
        }

        this.createHandbookFormService.update({
            editorUsers: [...editorUsers, user],
            viewerUsers: viewerUsers.filter(viewer => viewer.id !== user.id)
        });
    }

    protected removeRedactor(userId: string) {
        this.createHandbookFormService.update({
            editorUsers:
                this.values().editorUsers?.filter(
                    editor => editor.id !== userId
                ) ?? []
        });
    }

    protected addUsersToViewers(user: AstushaUserPreview) {
        const editorUsers = this.values().editorUsers ?? [];
        const viewerUsers = this.values().viewerUsers ?? [];

        if (
            editorUsers.some(editor => editor.id === user.id) ||
            viewerUsers.some(viewer => viewer.id === user.id)
        ) {
            return;
        }

        this.createHandbookFormService.update({
            viewerUsers: [...viewerUsers, user]
        });
    }

    protected removeViewer(userId: string) {
        this.createHandbookFormService.update({
            viewerUsers:
                this.values().viewerUsers?.filter(
                    viewer => viewer.id !== userId
                ) ?? []
        });
    }
}
