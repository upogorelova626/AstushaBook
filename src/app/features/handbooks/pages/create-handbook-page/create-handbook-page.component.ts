import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {TuiStepper} from '@taiga-ui/kit';
import {BasicInformationComponent} from '../../components/create-handbook-components/basic-information/basic-information.component';
import {TableStructureComponent} from '../../components/create-handbook-components/table-structure/table-structure.component';
import {SettingsComponent} from '../../components/create-handbook-components/settings/settings.component';
import {OwnerComponent} from '../../components/create-handbook-components/owner/owner.component';
import {TuiButton} from '@taiga-ui/core';

@Component({
    selector: 'app-create-handbook-page',
    imports: [
        TuiStepper,
        TuiButton,
        BasicInformationComponent,
        TableStructureComponent,
        SettingsComponent,
        OwnerComponent
    ],
    templateUrl: './create-handbook-page.component.html',
    styleUrl: './create-handbook-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateHandbookPageComponent {
    protected readonly activeStep = signal(0);
}
