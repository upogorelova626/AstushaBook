import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiTable} from '@taiga-ui/addon-table';

@Component({
    selector: 'app-handbooks-list',
    imports: [TuiTable],
    templateUrl: './handbooks-list.component.html',
    styleUrl: './handbooks-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbooksListComponent {
    protected readonly tableItems = [
        {
            icon: '',
            name: '',
            description: ''
        }
    ];
}
