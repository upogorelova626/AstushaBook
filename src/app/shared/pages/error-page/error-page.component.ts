import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {TuiButton} from '@taiga-ui/core';

@Component({
    selector: 'app-error-page',
    imports: [TuiButton],
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorPageComponent {
    private readonly router = inject(Router);

    protected goToMain() {
        this.router.navigate(['/astusha/main-page']);
    }
}
