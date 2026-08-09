import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {AstushaUserPreview} from '../../../../../shared/interfaces';
import {TuiAvatar} from '@taiga-ui/kit';

@Component({
    selector: 'app-user-preview',
    imports: [TuiAvatar],
    templateUrl: './user-preview.component.html',
    styleUrl: './user-preview.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPreviewComponent {
    readonly user = input.required<AstushaUserPreview>();
}
