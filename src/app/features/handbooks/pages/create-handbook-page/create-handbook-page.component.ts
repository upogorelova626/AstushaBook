import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import {TuiStepper} from '@taiga-ui/kit';
import {BasicInformationComponent} from '../../components/create-handbook-components/basic-information/basic-information.component';
import {TableStructureComponent} from '../../components/create-handbook-components/table-structure/table-structure.component';
import {TuiButton} from '@taiga-ui/core';
import {SettingsComponent} from '../../components/create-handbook-components/settings/settings.component';
import {SidebarHostComponent} from '../../components/host-drawer/sidebar-host.component';
import {SideBarService} from '../../components/host-drawer/sidebar.service';
import {CreateHandbookFormService} from '../../services/create-handbook-form.service';

@Component({
    selector: 'app-create-handbook-page',
    imports: [
        TuiStepper,
        TuiButton,
        BasicInformationComponent,
        TableStructureComponent,
        SidebarHostComponent,
        SettingsComponent
    ],
    templateUrl: './create-handbook-page.component.html',
    styleUrl: './create-handbook-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SideBarService]
})
export class CreateHandbookPageComponent {
    protected readonly activeStep = signal(0);

    private readonly createHandbookFormService = inject(
        CreateHandbookFormService
    );

    protected createHandbook() {
        this.createHandbookFormService.createHandbook();
    }
}
