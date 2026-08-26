import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    forwardRef,
    inject,
    Injector,
    input,
    OnInit,
    signal
} from '@angular/core';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
    NgControl,
    ReactiveFormsModule
} from '@angular/forms';
import {TuiError, TuiTextfield} from '@taiga-ui/core';
import {TuiChevron, TuiComboBox, TuiDataListWrapper} from '@taiga-ui/kit';
import {catchError, distinctUntilChanged, of, switchMap} from 'rxjs';

import {HandbookColumnResponse} from '../../../../../shared/interfaces';
import {HandbookService} from '../../../../../shared/services/handbook.service';

@Component({
    selector: 'app-search-handbook-column',
    imports: [
        ReactiveFormsModule,
        TuiTextfield,
        TuiComboBox,
        TuiChevron,
        TuiDataListWrapper,
        TuiError
    ],
    templateUrl: './search-handbook-column.component.html',
    styleUrl: './search-handbook-column.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchHandbookColumnComponent),
            multi: true
        }
    ]
})
export class SearchHandbookColumnComponent
    implements ControlValueAccessor, OnInit
{
    private readonly handbookService = inject(HandbookService);
    private readonly injector = inject(Injector);
    private readonly destroyRef = inject(DestroyRef);

    private readonly selectedColumnId = signal<string | null>(null);

    private onTouched: () => void = () => undefined;
    private onChange: (value: string | null) => void = () => undefined;

    protected parentNgControl: NgControl | null = null;

    protected readonly handbookColumns = signal<HandbookColumnResponse[]>([]);
    protected readonly foundColumns = signal<HandbookColumnResponse[]>([]);

    protected readonly columnControl = new FormControl<
        HandbookColumnResponse | string
    >('', {
        nonNullable: true
    });

    protected readonly stringifyColumn = (
        column: HandbookColumnResponse | string
    ): string => {
        return typeof column === 'string' ? column : column.name;
    };

    readonly handbookId = input.required<string>();

    ngOnInit() {
        this.parentNgControl = this.injector.get(NgControl, null, {
            self: true
        });

        this.listenHandbookChanges();
        this.listenColumnChanges();
    }

    writeValue(columnId: string | null) {
        this.selectedColumnId.set(columnId);
        this.setSelectedColumn();
    }

    registerOnChange(fn: (value: string | null) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        if (isDisabled) {
            this.columnControl.disable({
                emitEvent: false
            });

            return;
        }

        this.columnControl.enable({
            emitEvent: false
        });
    }

    protected lossFocus() {
        this.onTouched();
    }

    protected isParentInvalid(): boolean | null {
        const control = this.parentNgControl?.control;

        return control?.invalid && control.touched ? true : null;
    }

    private listenHandbookChanges() {
        toObservable(this.handbookId, {
            injector: this.injector
        })
            .pipe(
                distinctUntilChanged(),
                switchMap(handbookId =>
                    this.handbookService
                        .getHandbook(handbookId)
                        .pipe(catchError(() => of(null)))
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(handbook => {
                const columns = handbook?.columns ?? [];

                this.handbookColumns.set(columns);
                this.foundColumns.set(columns);

                this.setSelectedColumn();
            });
    }

    private listenColumnChanges() {
        this.columnControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                if (typeof value === 'string') {
                    this.searchColumns(value);

                    const selectedColumn = this.getSelectedColumn();

                    if (selectedColumn && value === selectedColumn.name) {
                        return;
                    }

                    this.selectedColumnId.set(null);
                    this.onChange(null);

                    return;
                }

                this.selectedColumnId.set(value.id);
                this.foundColumns.set(this.handbookColumns());

                this.onChange(value.id);
                this.onTouched();
            });
    }

    private searchColumns(query: string) {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            this.foundColumns.set(this.handbookColumns());

            return;
        }

        this.foundColumns.set(
            this.handbookColumns().filter(column =>
                column.name.toLowerCase().includes(normalizedQuery)
            )
        );
    }

    private setSelectedColumn() {
        const selectedColumn = this.getSelectedColumn();

        this.columnControl.setValue(selectedColumn ?? '', {
            emitEvent: false
        });

        this.foundColumns.set(this.handbookColumns());
    }

    private getSelectedColumn(): HandbookColumnResponse | null {
        const columnId = this.selectedColumnId();

        if (!columnId) {
            return null;
        }

        return (
            this.handbookColumns().find(column => column.id === columnId) ??
            null
        );
    }
}
