import {Component} from '@angular/core';
import {TuiInput, TuiTextfield, TuiButton} from '@taiga-ui/core';
import {TuiSegmented} from '@taiga-ui/kit';

@Component({
    selector: 'app-handbook-toolbar',
    imports: [TuiTextfield, TuiInput, TuiSegmented, TuiButton],
    templateUrl: './handbook-toolbar.component.html',
    styleUrl: './handbook-toolbar.component.less'
})
export class HandbookToolbarComponent {}
