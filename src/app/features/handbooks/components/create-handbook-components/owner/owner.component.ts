import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {UserService} from '../../../../auth/services/user.service';
import {AsyncPipe} from '@angular/common';

@Component({
    selector: 'app-owner',
    imports: [TuiAvatar, TuiButton, AsyncPipe],
    templateUrl: './owner.component.html',
    styleUrl: './owner.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnerComponent {
    private readonly userService = inject(UserService);

    protected readonly currentUser$ = this.userService.currentUser$;
}
