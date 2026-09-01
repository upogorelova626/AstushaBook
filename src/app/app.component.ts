import {Component, computed, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TuiRoot} from '@taiga-ui/core';
import {UserService} from './shared/services/user.service';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TuiRoot],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less'
})
export class AppComponent {
    title = 'astusha-book';

    private readonly usersService = inject(UserService);

    private readonly currentUser = toSignal(this.usersService.currentUser$, {
        initialValue: null
    });

    protected readonly tuiTheme = computed(() =>
        this.currentUser()?.theme === 'DARK' ? 'dark' : 'light'
    );
}
