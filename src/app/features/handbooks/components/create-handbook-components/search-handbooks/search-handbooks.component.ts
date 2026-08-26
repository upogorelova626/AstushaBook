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
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
    NgControl,
    ReactiveFormsModule
} from '@angular/forms';
import {TUI_VALIDATION_ERRORS, TuiError, TuiTextfield} from '@taiga-ui/core';
import {TuiChevron, TuiComboBox, TuiDataListWrapper} from '@taiga-ui/kit';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    map,
    of,
    Subject,
    switchMap
} from 'rxjs';
import {
    HandbookListFilter,
    HandbookPreview
} from '../../../../../shared/interfaces';
import {HandbookService} from '../../../../../shared/services/handbook.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-search-handbooks',
    imports: [
        ReactiveFormsModule,
        TuiTextfield,
        TuiComboBox,
        TuiChevron,
        TuiDataListWrapper,
        TuiError
    ],
    templateUrl: './search-handbooks.component.html',
    styleUrl: './search-handbooks.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useFactory: () => ({
                minlength: ({requiredLength}: {requiredLength: number}) =>
                    `Введите минимум ${requiredLength} символа`,

                maxlength: ({requiredLength}: {requiredLength: number}) =>
                    `Введите не более ${requiredLength} символов`
            })
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchHandbooksComponent),
            multi: true
        }
    ]
})
export class SearchHandbooksComponent implements ControlValueAccessor, OnInit {
    private readonly injector = inject(Injector);
    private readonly destroyRef = inject(DestroyRef);
    private readonly handbookService = inject(HandbookService);
    private readonly router = inject(Router);

    private readonly selectedHandbook = signal<HandbookPreview | null>(null);

    private onTouched: () => void = () => undefined;
    private onChange: (value: HandbookPreview | null) => void = () => undefined;

    protected parentNgControl: NgControl | null = null;

    protected readonly foundedHandbooks = signal<HandbookPreview[] | null>([]);
    protected readonly search$ = new Subject<string>();
    protected readonly isSearching = signal(false);

    protected readonly searchHandbookControl = new FormControl<
        HandbookPreview | string
    >('', {
        nonNullable: true,
        validators: []
    });

    protected readonly stringifyHandbook = (
        handbook: HandbookPreview
    ): string => {
        return handbook.name || '';
    };

    readonly isMainPage = input(true);

    ngOnInit() {
        this.parentNgControl = this.injector.get(NgControl, null, {
            self: true
        });

        this.search$
            .pipe(
                map(value => {
                    this.foundedHandbooks.set(null);

                    return value;
                }),
                debounceTime(300),
                distinctUntilChanged(),
                switchMap(query => {
                    if (
                        this.searchHandbookControl.invalid ||
                        query.length < 2
                    ) {
                        this.isSearching.set(false);
                        this.foundedHandbooks.set([]);
                        return of([]);
                    }

                    this.isSearching.set(true);

                    return this.handbookService
                        .getHandbooksPreviews({
                            name: query,
                            tags: [],
                            filter: HandbookListFilter.Available,
                            offset: 0
                        })
                        .pipe(
                            map(response => response.items),
                            catchError(() => of([])),
                            finalize(() => {
                                this.isSearching.set(false);
                            })
                        );
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(handbooks => {
                this.foundedHandbooks.set(handbooks);
            });

        this.searchHandbookControl.valueChanges
            .pipe(
                filter(
                    (value): value is HandbookPreview =>
                        value !== null && typeof value !== 'string'
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(handbook => this.addHandbook(handbook));
    }

    writeValue(handbook: HandbookPreview | null) {
        this.selectedHandbook.set(handbook);

        this.searchHandbookControl.setValue(handbook ?? '', {
            emitEvent: false
        });

        this.foundedHandbooks.set([]);
    }

    registerOnChange(fn: (value: HandbookPreview | null) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        if (isDisabled) {
            this.searchHandbookControl.disable({
                emitEvent: false
            });

            return;
        }

        this.searchHandbookControl.enable({
            emitEvent: false
        });
    }

    protected onSearchInput(query: string) {
        const inputValue = query.trim();
        const selectedHandbook = this.selectedHandbook();

        if (
            selectedHandbook &&
            inputValue === this.stringifyHandbook(selectedHandbook)
        ) {
            return;
        }

        this.selectedHandbook.set(null);
        this.onChange(null);

        if (!inputValue) {
            this.foundedHandbooks.set([]);
            this.search$.next('');

            return;
        }

        this.search$.next(inputValue);
    }

    protected lossFocus() {
        this.onTouched();
    }

    protected isParentInvalid(): boolean | null {
        const control = this.parentNgControl?.control;

        return control?.invalid && control.touched ? true : null;
    }

    protected addHandbook(handbook: HandbookPreview) {
        this.selectedHandbook.set(handbook);

        this.searchHandbookControl.setValue(handbook, {
            emitEvent: false
        });

        this.foundedHandbooks.set([]);

        this.onChange(handbook);
        this.onTouched();
    }

    protected goToHandbook(event: HandbookPreview) {
        this.router.navigate(['astusha', 'handbooks', event.id]);
    }
}
