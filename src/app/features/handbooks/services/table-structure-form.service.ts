import {Injectable, signal} from '@angular/core';
import {HandbookAttribute} from '../../../shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class TableStructureFormService {
    tableStuctureValues = signal<HandbookAttribute[]>([]);

    add(newColumn: HandbookAttribute) {
        this.tableStuctureValues.update(columns => [...columns, newColumn]);
    }

    delete(index: number) {
        this.tableStuctureValues.update(values =>
            values.filter((_, valueIndex) => valueIndex !== index)
        );
    }

    update(index: number, newValues: Partial<HandbookAttribute>) {
        this.tableStuctureValues.update(currentValues => {
            const currentValue = currentValues[index];

            if (!currentValue) {
                return currentValues;
            }

            return [
                ...currentValues.slice(0, index),
                {
                    ...currentValue,
                    ...newValues
                },
                ...currentValues.slice(index + 1)
            ];
        });
    }
}
