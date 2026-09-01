import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiHint, TuiButton} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {AsyncPipe} from '@angular/common';
import {UserService} from '../../../shared/services/user.service';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-layout-header',
    imports: [TuiAvatar, TuiHint, AsyncPipe, TuiButton, RouterLink],
    templateUrl: './layout-header.component.html',
    styleUrl: './layout-header.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutHeaderComponent {
    private readonly usersService = inject(UserService);

    currentUser$ = this.usersService.currentUser$;

    protected goToAstushaId() {
        window.location.href = 'http://localhost:4202/account/profile';
    }
}
