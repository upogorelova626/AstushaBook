import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-search-handbook-column',
    imports: [ReactiveFormsModule],
    templateUrl: './search-handbook-column.component.html',
    styleUrl: './search-handbook-column.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchHandbookColumnComponent {
    readonly formControl = input.required<FormControl<string | null>>();

    readonly handbookId = input.required<string>();
}
