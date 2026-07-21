import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';

import {AstushaUserPreview} from '../../../../../shared/interfaces';

@Component({
    selector: 'app-user-searching-results',
    imports: [TuiAvatar, TuiButton],
    templateUrl: './user-searching-results.component.html',
    styleUrl: './user-searching-results.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSearchingResultsComponent {
    readonly foundUsers = input.required<AstushaUserPreview[]>();
    readonly selectedUsers = input<AstushaUserPreview[]>([]);

    readonly userAdded = output<AstushaUserPreview>();

    protected isSelected(userId: string) {
        return this.selectedUsers().some(user => user.id === userId);
    }

    protected addUser(user: AstushaUserPreview) {
        this.userAdded.emit(user);
    }
}
