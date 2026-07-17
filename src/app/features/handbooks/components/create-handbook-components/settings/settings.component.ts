import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
    TuiChevron,
    TuiDataListWrapper,
    TuiSelect,
    TuiSwitch
} from '@taiga-ui/kit';
import {
    TuiDropdownDirective,
    TuiInput,
    TuiLabel,
    TuiTextfield
} from '@taiga-ui/core';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-settings',
    imports: [
        TuiSwitch,
        TuiTextfield,
        TuiInput,
        TuiLabel,
        TuiSelect,
        TuiChevron,
        FormsModule,
        TuiDataListWrapper,
        TuiDropdownDirective
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
    protected value1: string | null = null;

    protected value2: string | null = null;

    protected readonly visibilityItems = [
        'Для всех',
        'Длч выбранных пользователей',
        'Только владелец'
    ];

    protected readonly editingItems = [
        'Только влaделец',
        'Выбранные редакторы',
        'Все с доступом'
    ];
}
