import {Injectable} from '@angular/core';
import {BaseBarService} from './base-bar.service';

export interface SidebarOptions {
    overlay?: boolean;
    closeOnClickOutside?: boolean;
    rounded?: boolean;
    offset?: boolean;
}

@Injectable()
export class SideBarService extends BaseBarService<SidebarOptions> {}
