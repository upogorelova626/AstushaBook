import {Injectable, OnDestroy} from '@angular/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {BehaviorSubject, Observable} from 'rxjs';

export type BarContext<
    T = Record<string, unknown>,
    CompleteResult = undefined
> = {
    complete: (result?: CompleteResult) => void;
} & T;

export interface BarItem<
    Component,
    Options,
    CompleteResult,
    Context = Record<string, unknown>
> {
    component: PolymorpheusComponent<Component>;
    options?: Options;
    context: BarContext<Context, CompleteResult>;
}

@Injectable()
export class BaseBarService<Options> implements OnDestroy {
    private readonly _items$ = new BehaviorSubject<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        BarItem<unknown, Options, any, Record<string, unknown>>[]
    >([]);

    readonly items$ = this._items$.asObservable();

    open$<Component, CompleteResult>(
        component: PolymorpheusComponent<Component>,
        options?: Options,
        context?: Record<string, unknown>
    ): Observable<CompleteResult> {
        return new Observable(observer => {
            const item = {
                component,
                options,
                context: {
                    ...context,
                    complete: (result: CompleteResult) => {
                        observer.next(result);
                        observer.complete();
                    }
                }
            };

            this._items$.next([...this._items$.getValue(), item]);

            return () => {
                this._items$.next(
                    this._items$.getValue().filter(value => value !== item)
                );
            };
        });
    }

    ngOnDestroy() {
        for (const item of this._items$.getValue()) {
            item.context.complete(null);
        }
    }
}
