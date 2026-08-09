import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {
    TUI_VALIDATION_ERRORS,
    TuiButton,
    TuiCheckbox,
    TuiError,
    TuiFilterByInputPipe,
    TuiInput,
    TuiTextfield
} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {
    HandbookAttribute,
    HandbookColumnType
} from '../../../../../shared/interfaces';
import {BarContext} from '../../host-drawer/base-bar.service';
import {
    TuiChevron,
    TuiComboBox,
    TuiDataListWrapper,
    TuiStringifyContentPipe
} from '@taiga-ui/kit';

interface AttributeFormContext {
    data?: HandbookAttribute;
}

@Component({
    selector: 'app-attribute-form',
    imports: [
        TuiInput,
        TuiTextfield,
        TuiError,
        TuiButton,
        TuiCheckbox,
        TuiChevron,
        TuiComboBox,
        TuiDataListWrapper,
        TuiFilterByInputPipe,
        TuiStringifyContentPipe,
        ReactiveFormsModule
    ],
    templateUrl: './attribute-form.component.html',
    styleUrl: './attribute-form.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useFactory: () => ({
                required: 'Поле обязательно для заполнения',

                minlength: ({requiredLength}: {requiredLength: number}) =>
                    `Введите минимум ${requiredLength} символа`,

                maxlength: ({requiredLength}: {requiredLength: number}) =>
                    `Введите не более ${requiredLength} символов`
            })
        }
    ]
})
export class AttributeFormComponent {
    protected readonly context =
        injectContext<
            BarContext<AttributeFormContext, HandbookAttribute | null>
        >();

    protected readonly form = new FormGroup({
        name: new FormControl(this.context.data?.name ?? '', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(100)]
        }),
        type: new FormControl(
            this.context.data?.type ?? HandbookColumnType.Text,
            {
                nonNullable: true
            }
        ),
        required: new FormControl(this.context.data?.required ?? false, {
            nonNullable: true
        })
    });

    protected readonly items = [
        HandbookColumnType.Text,
        HandbookColumnType.Number,
        HandbookColumnType.Boolean,
        HandbookColumnType.Date,
        HandbookColumnType.List,
        HandbookColumnType.User,
        HandbookColumnType.Reference,
        HandbookColumnType.FormattedString
    ];

    protected readonly labels: Record<HandbookColumnType, string> = {
        [HandbookColumnType.Text]: 'Текст',
        [HandbookColumnType.Number]: 'Число',
        [HandbookColumnType.Boolean]: 'Логическое значение',
        [HandbookColumnType.Date]: 'Дата',
        [HandbookColumnType.List]: 'Список',
        [HandbookColumnType.User]: 'Пользователь',
        [HandbookColumnType.Reference]: 'Значение из другого справочника',
        [HandbookColumnType.FormattedString]: 'Форматированная строка'
    };

    protected readonly stringify = (type: HandbookColumnType): string =>
        this.labels[type];

    protected save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.context.complete(this.form.getRawValue());
    }

    protected cancel() {
        this.context.complete(null);
    }
}
