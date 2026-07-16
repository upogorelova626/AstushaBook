import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiHint} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {AsyncPipe} from '@angular/common';
import {UserService} from '../../../features/auth/services/user.service';

@Component({
    selector: 'app-layout-header',
    imports: [TuiButton, TuiAvatar, TuiHint, AsyncPipe],
    templateUrl: './layout-header.component.html',
    styleUrl: './layout-header.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutHeaderComponent {
    private readonly usersService = inject(UserService);

    currentUser$ = this.usersService.currentUser$;
}
