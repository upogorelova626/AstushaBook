import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiButton} from '@taiga-ui/core';
import {TuiBadge, TuiAvatar} from '@taiga-ui/kit';
import {HandbookPreview} from '../../interfaces';

@Component({
    selector: 'app-handbook-preview-item',
    imports: [TuiButton, TuiBadge, TuiAvatar, RouterLink],
    templateUrl: './handbook-preview-item.component.html',
    styleUrl: './handbook-preview-item.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookPreviewItemComponent {
    readonly handbook = input.required<HandbookPreview>();
}
