import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Injector,
    signal
} from '@angular/core';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragHandle,
    CdkDropList,
    moveItemInArray
} from '@angular/cdk/drag-drop';
import {BarContext} from '../../../handbooks/components/host-drawer/base-bar.service';
import {
    Handbook,
    HandbookAttribute,
    HandbookColumnResponse,
    HandbookColumnType
} from '../../../../shared/interfaces';
import {injectContext, PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {TuiButton, TuiNotificationService} from '@taiga-ui/core';
import {TuiBadge} from '@taiga-ui/kit';
import {AttributeTypePipe} from '../../../../shared/pipes/attribute-type.pipe';
import {SideBarService} from '../../../handbooks/components/host-drawer/sidebar.service';
import {AttributeFormComponent} from '../../../handbooks/components/create-handbook-components/attribute-form/attribute-form.component';
import {HandbookService} from '../../../../shared/services/handbook.service';
import {catchError, EMPTY, tap} from 'rxjs';

@Component({
    selector: 'app-edit-handbook-attributes',
    imports: [
        TuiButton,
        TuiBadge,
        AttributeTypePipe,
        CdkDropList,
        CdkDrag,
        CdkDragHandle
    ],
    templateUrl: './edit-handbook-attributes.component.html',
    styleUrl: './edit-handbook-attributes.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditHandbookAttributesComponent {
    private readonly sidebarService = inject(SideBarService);
    private readonly handbookService = inject(HandbookService);
    private readonly injector = inject(Injector);
    private readonly alerts = inject(TuiNotificationService);

    protected readonly context =
        injectContext<BarContext<{handbook: Handbook}, Handbook | null>>();

    protected readonly handbook = this.context.handbook;

    protected readonly originalHandbookAttributes = this.handbook.columns;

    protected readonly draftHandbookAttributes = signal<
        (HandbookColumnResponse | HandbookAttribute)[]
    >(
        this.originalHandbookAttributes.map(attribute => ({
            ...attribute,
            options: [...(attribute.options ?? [])]
        }))
    );

    protected readonly HandbookColumnType = HandbookColumnType;

    protected editAttribute(index: number, event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const attribute = this.draftHandbookAttributes()[index];

        this.sidebarService
            .open$<AttributeFormComponent, HandbookAttribute | null>(
                new PolymorpheusComponent(
                    AttributeFormComponent,
                    this.injector
                ),
                {
                    overlay: true,
                    rounded: true,
                    offset: true
                },
                {
                    data: attribute
                }
            )
            .subscribe(result => {
                if (result) {
                    this.updateAttribute(index, result);
                }
            });
    }

    protected createAttribute(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.sidebarService
            .open$<AttributeFormComponent, HandbookAttribute | null>(
                new PolymorpheusComponent(
                    AttributeFormComponent,
                    this.injector
                ),
                {
                    overlay: true,
                    rounded: true,
                    offset: true
                }
            )
            .subscribe(result => {
                if (result) {
                    this.addNewAttribute(result);
                }
            });
    }

    protected dropAttribute(
        event: CdkDragDrop<(HandbookColumnResponse | HandbookAttribute)[]>
    ): void {
        this.draftHandbookAttributes.update(attributes => {
            const reorderedAttributes = [...attributes];

            moveItemInArray(
                reorderedAttributes,
                event.previousIndex,
                event.currentIndex
            );

            return reorderedAttributes;
        });
    }

    protected save() {
        const payload = {
            columns: this.draftHandbookAttributes().map(attribute => ({
                ...('id' in attribute ? {id: attribute.id} : {}),
                name: attribute.name.trim(),
                type: attribute.type,
                required: attribute.required,
                options:
                    attribute.type === HandbookColumnType.List
                        ? attribute.options.map(option => option.trim())
                        : []
            }))
        };

        this.handbookService
            .editHandbookAttributes(this.handbook.id, payload)
            .pipe(
                tap(() => {
                    this.alerts
                        .open('Атрибуты успешно обновлены', {
                            label: 'Готово',
                            appearance: 'positive'
                        })
                        .subscribe();
                }),
                catchError(() => {
                    this.alerts
                        .open(
                            'Не удалось обновить атрибуты. Попробуйте ещё раз',
                            {
                                label: 'Ошибка',
                                appearance: 'negative'
                            }
                        )
                        .subscribe();

                    return EMPTY;
                })
            )
            .subscribe(updatedHandbook => {
                this.context.complete(updatedHandbook);
            });
    }

    protected deleteAttribute(index: number) {
        this.draftHandbookAttributes.update(values =>
            values.filter((_, valueIndex) => valueIndex !== index)
        );
    }

    private addNewAttribute(newAttribute: HandbookAttribute) {
        this.draftHandbookAttributes.update(currentAttributes => [
            ...currentAttributes,
            newAttribute
        ]);
    }

    private updateAttribute(index: number, newAttribute: HandbookAttribute) {
        this.draftHandbookAttributes.update(currentValues => {
            const currentValue = currentValues[index];

            if (!currentValue) {
                return currentValues;
            }

            return [
                ...currentValues.slice(0, index),
                {
                    ...currentValue,
                    ...newAttribute
                },
                ...currentValues.slice(index + 1)
            ];
        });
    }
}
