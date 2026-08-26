import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiTextfield, TuiButton} from '@taiga-ui/core';
import {RouterLink} from '@angular/router';
import {SearchHandbooksComponent} from '../../../handbooks/components/create-handbook-components/search-handbooks/search-handbooks.component';

@Component({
    selector: 'app-welcome-card',
    imports: [TuiTextfield, TuiButton, RouterLink, SearchHandbooksComponent],
    templateUrl: './welcome-card.component.html',
    styleUrl: './welcome-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeCardComponent {}
