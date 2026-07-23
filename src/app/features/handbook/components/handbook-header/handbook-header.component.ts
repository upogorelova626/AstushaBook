import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {Handbook} from '../../../../shared/interfaces';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-handbook-header',
    imports: [TuiButton, RouterLink],
    templateUrl: './handbook-header.component.html',
    styleUrl: './handbook-header.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookHeaderComponent {
    readonly handbook = input<Handbook | null>(null);
}
