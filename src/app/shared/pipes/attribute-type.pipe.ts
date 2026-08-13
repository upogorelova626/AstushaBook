import {Pipe, PipeTransform} from '@angular/core';
import {HandbookColumnType} from '../interfaces';

@Pipe({
    name: 'attributeType'
})
export class AttributeTypePipe implements PipeTransform {
    transform(value: HandbookColumnType): string {
        const labels: Record<HandbookColumnType, string> = {
            [HandbookColumnType.Text]: 'Текст',
            [HandbookColumnType.Number]: 'Число',
            [HandbookColumnType.Boolean]: 'Логическое',
            [HandbookColumnType.Date]: 'Дата',
            [HandbookColumnType.List]: 'Список',
            [HandbookColumnType.User]: 'Сотрудник',
            [HandbookColumnType.Reference]: 'Значение из справочника',
            [HandbookColumnType.FormattedString]: 'Форматированная строка'
        };

        return labels[value];
    }
}
