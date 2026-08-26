import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiInput, TuiTextfield} from '@taiga-ui/core';
import {TuiSegmented} from '@taiga-ui/kit';
import {debounceTime, distinctUntilChanged, map} from 'rxjs';
import {HandbooksListService} from '../../../services/handbooks-list.service';

@Component({
    selector: 'app-handbook-toolbar',
    imports: [TuiTextfield, TuiInput, TuiSegmented, ReactiveFormsModule],
    templateUrl: './handbook-toolbar.component.html',
    styleUrl: './handbook-toolbar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandbookToolbarComponent implements OnInit {
    private readonly handbooksListService = inject(HandbooksListService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly searchControl = new FormControl('', {
        nonNullable: true
    });

    protected readonly isSearchByName = signal(true);

    ngOnInit() {
        this.searchControl.valueChanges
            .pipe(
                map(value => value.trim()),
                debounceTime(300),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(value => {
                this.updateSearch(value);
            });
    }

    private updateSearch(value: string) {
        if (this.isSearchByName()) {
            this.handbooksListService.updateRequest({
                name: value,
                tags: []
            });

            return;
        }

        this.handbooksListService.updateRequest({
            name: '',
            tags: value ? [value] : []
        });
    }
}
