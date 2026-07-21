import {AstushaUserPreview} from './search-user.interface';

export enum HandbookVisibility {
    Public = 'EVERYONE',
    SelectedUsers = 'SELECTED_USERS',
    OwnerOnly = 'OWNER_ONLY'
}

export enum HandbookEditingAccess {
    OwnerOnly = 'OWNER_ONLY',
    SelectedEditors = 'SELECTED_EDITORS',
    EveryoneWithAccess = 'EVERYONE_WITH_ACCESS'
}

export enum HandbookColumnType {
    Text = 'TEXT',
    Number = 'NUMBER',
    Boolean = 'BOOLEAN',
    Date = 'DATE'
}

export interface HandbookAttribute {
    name: string;
    type: HandbookColumnType;
    required: boolean;
}

export interface CreateHandbookRequest {
    name: string;
    description: string;
    systemName: string;
    tags: string[];
    columns: HandbookAttribute[];
    visibility: HandbookVisibility;
    editingPermission: HandbookEditingAccess;
    editorIds: string[];
    viewerIds: string[];
}

export interface CreateHandbookFormValues {
    name: string;
    description: string;
    systemName: string;
    tags: string[];
    columns: HandbookAttribute[];
    visibility: HandbookVisibility;
    editingPermission: HandbookEditingAccess;
    editorUsers: AstushaUserPreview[];
    viewerUsers: AstushaUserPreview[];
}

export interface Handbook {
    id: string;
    name: string;
    description: string | null;
    systemName: string;
    tags: string[];
    ownerId: string;
    visibility: HandbookVisibility;
    editingPermission: HandbookEditingAccess;
    createdAt: string;
    updatedAt: string;
    columns: HandbookColumnResponse[];
    editors: HandbookParticipant[];
    viewers: HandbookParticipant[];
}

export interface HandbookColumnResponse extends HandbookAttribute {
    id: string;
    handbookId: string;
    position: number;
    createdAt: string;
    updatedAt: string;
}

export interface HandbookParticipant {
    handbookId: string;
    userId: string;
    addedAt: string;
}
