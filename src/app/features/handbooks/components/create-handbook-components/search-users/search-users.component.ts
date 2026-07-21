import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    input,
    OnInit,
    output,
    signal
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    TUI_VALIDATION_ERRORS,
    TuiDropdown,
    TuiError,
    TuiInput,
    TuiLabel,
    TuiTextfield
} from '@taiga-ui/core';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    finalize,
    map,
    of,
    switchMap
} from 'rxjs';

import {AstushaUserPreview} from '../../../../../shared/interfaces';
import {UsersService} from '../../../../../shared/services/users.service';
import {UserSearchingResultsComponent} from '../user-searching-results/user-searching-results.component';

@Component({
    selector: 'app-search-users',
    imports: [
        TuiInput,
        TuiTextfield,
        TuiLabel,
        TuiError,
        TuiDropdown,
        ReactiveFormsModule,
        UserSearchingResultsComponent
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
        }
    ]
})
export class SearchUsersComponent implements OnInit {
    private readonly usersService = inject(UsersService);
    private readonly destroyRef = inject(DestroyRef);

    readonly selectedUsers = input<AstushaUserPreview[]>([]);
    readonly userSelected = output<AstushaUserPreview>();

    protected readonly isSearching = signal(false);
    protected readonly foundUsers = signal<AstushaUserPreview[]>([]);

    protected readonly searchUserControl = new FormControl('', {
        nonNullable: true,
        validators: [Validators.minLength(2), Validators.maxLength(254)]
    });

    ngOnInit() {
        this.searchUserControl.valueChanges
            .pipe(
                map(value => value.trim()),
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
    }

    protected addUser(user: AstushaUserPreview) {
        if (
            this.selectedUsers().some(
                selectedUser => selectedUser.id === user.id
            )
        ) {
            return;
        }

        this.userSelected.emit(user);

        this.searchUserControl.setValue('', {emitEvent: false});
        this.foundUsers.set([]);
    }
}
