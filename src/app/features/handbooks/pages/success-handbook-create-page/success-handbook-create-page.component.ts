import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TuiButton} from '@taiga-ui/core';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-success-handbook-create-page',
    imports: [TuiButton, RouterLink],
    templateUrl: './success-handbook-create-page.component.html',
    styleUrl: './success-handbook-create-page.component.less'
})
export class SuccessHandbookCreatePageComponent {
    private readonly route = inject(ActivatedRoute);

    protected readonly handbookId = this.route.snapshot.queryParamMap.get('id');

    protected readonly handbookName =
        this.route.snapshot.queryParamMap.get('name');
}
