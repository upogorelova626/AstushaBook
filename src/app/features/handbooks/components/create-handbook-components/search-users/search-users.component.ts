import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    forwardRef,
    inject,
    Injector,
    input,
    OnInit,
    output,
    signal
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
    NgControl,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {
    TUI_VALIDATION_ERRORS,
    TuiError,
    TuiLabel,
    TuiTextfield
} from '@taiga-ui/core';
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

import {AstushaUserPreview} from '../../../../../shared/interfaces';
import {UsersService} from '../../../../../shared/services/users.service';
import {UserPreviewComponent} from '../user-preview/user-preview.component';

@Component({
    selector: 'app-search-users',
    imports: [
        TuiTextfield,
        TuiLabel,
        TuiError,
        TuiComboBox,
        TuiChevron,
        TuiDataListWrapper,
        ReactiveFormsModule,
        UserPreviewComponent
    ],
    templateUrl: './search-users.component.html',
    styleUrl: './search-users.component.less',
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
            useExisting: forwardRef(() => SearchUsersComponent),
            multi: true
        }
    ]
})
export class SearchUsersComponent implements OnInit, ControlValueAccessor {
    private readonly usersService = inject(UsersService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly injector = inject(Injector);

    private readonly selectedUser = signal<AstushaUserPreview | null>(null);

    private onChange: (value: AstushaUserPreview | null) => void = () =>
        undefined;

    private onTouched: () => void = () => undefined;

    protected parentNgControl: NgControl | null = null;

    protected readonly search$ = new Subject<string>();
    protected readonly isSearching = signal(false);
    protected readonly foundUsers = signal<AstushaUserPreview[] | null>([]);

    protected readonly searchUserControl = new FormControl<
        AstushaUserPreview | string
    >('', {
        nonNullable: true,
        validators: [Validators.minLength(2), Validators.maxLength(254)]
    });

    protected readonly stringifyUser = (user: AstushaUserPreview): string => {
        const fullName = [user.lastName, user.firstName]
            .filter(Boolean)
            .join(' ');

        return fullName || user.login || '';
    };

    readonly selectedUsers = input<AstushaUserPreview[]>([]);
    readonly userSelected = output<AstushaUserPreview>();
    readonly isRowAddingOrEditing = input(false);

    ngOnInit() {
        this.parentNgControl = this.injector.get(NgControl, null, {
            self: true
        });

        this.search$
            .pipe(
                map(value => {
                    this.foundUsers.set(null);

                    return value;
                }),
                debounceTime(300),
                distinctUntilChanged(),
                switchMap(query => {
                    if (this.searchUserControl.invalid || query.length < 2) {
                        this.isSearching.set(false);
                        this.foundUsers.set([]);

                        return of([]);
                    }

                    this.isSearching.set(true);

                    return this.usersService.searchUsers({query}).pipe(
                        catchError(() => of([])),
                        finalize(() => {
                            this.isSearching.set(false);
                        })
                    );
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(users => {
                this.foundUsers.set(users);
            });

        this.searchUserControl.valueChanges
            .pipe(
                filter(
                    (value): value is AstushaUserPreview =>
                        value !== null && typeof value !== 'string'
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(user => {
                this.addUser(user);
            });
    }

    writeValue(user: AstushaUserPreview | null) {
        this.selectedUser.set(user);

        this.searchUserControl.setValue(user ?? '', {
            emitEvent: false
        });

        this.foundUsers.set([]);
    }

    registerOnChange(fn: (value: AstushaUserPreview | null) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        if (isDisabled) {
            this.searchUserControl.disable({emitEvent: false});

            return;
        }

        this.searchUserControl.enable({emitEvent: false});
    }

    protected onSearchInput(query: string) {
        const inputValue = query.trim();
        const selectedUser = this.selectedUser();

        if (selectedUser && inputValue === this.stringifyUser(selectedUser)) {
            return;
        }

        this.selectedUser.set(null);
        this.onChange(null);

        if (!inputValue) {
            this.foundUsers.set([]);
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

    protected addUser(user: AstushaUserPreview): void {
        const userAlreadySelected = this.selectedUsers().some(
            selectedUser => selectedUser.id === user.id
        );

        if (userAlreadySelected) {
            return;
        }

        this.selectedUser.set(user);

        this.searchUserControl.setValue(user, {
            emitEvent: false
        });

        this.foundUsers.set([]);

        this.onChange(user);
        this.onTouched();

        this.userSelected.emit(user);
    }
}
