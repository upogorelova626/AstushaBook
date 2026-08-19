import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {SearchHandbooksComponent} from '../search-handbooks/search-handbooks.component';
import {SearchHandbookColumnComponent} from '../search-handbook-column/search-handbook-column.component';
import {HandbookPreview} from '../../../../../shared/interfaces';

@Component({
    selector: 'app-reference-attribute-settings',
    imports: [
        SearchHandbooksComponent,
        SearchHandbookColumnComponent,
        ReactiveFormsModule
    ],
    templateUrl: './reference-attribute-settings.component.html',
    styleUrl: './reference-attribute-settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferenceAttributeSettingsComponent {
    readonly form = input.required<
        FormGroup<{
            handbook: FormControl<HandbookPreview | null>;
            columnId: FormControl<string | null>;
        }>
    >();
}
