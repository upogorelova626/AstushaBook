import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-handbook-page',
    imports: [],
    templateUrl: './handbook-page.component.html',
    styleUrl: './handbook-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookPageComponent {}
