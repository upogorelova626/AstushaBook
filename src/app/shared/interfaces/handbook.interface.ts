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
    Date = 'DATE',
    List = 'LIST',
    User = 'USER',
    Reference = 'REFERENCE',
    FormattedString = 'FORMATTED_STRING'
}

export interface HandbookAttribute {
    name: string;
    type: HandbookColumnType;
    required: boolean;
    options: string[];
}

export enum HandbookListFilter {
    All = 'ALL',
    Mine = 'MINE',
    Available = 'AVAILABLE',
    Favorites = 'FAVORITES'
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
    description: string;
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
    options: string[];
    createdAt: string;
    updatedAt: string;
}

export interface HandbookParticipant {
    handbookId: string;
    userId: string;
    addedAt: string;
}

export interface GetHandbooksRequest {
    name: string;
    tags: string[];
    filter: HandbookListFilter;
    offset?: number;
}

export interface HandbookPreview {
    id: string;
    name: string;
    description: string;
    tags: string[];
    updatedAt: string;
    hasAccess: boolean;
    owner: AstushaUserPreview;
    isFavorite: boolean;
}

export interface GetHandbooksResponse {
    items: HandbookPreview[];
    nextOffset: number | null;
}

export interface AddHandbookRowRequest {
    values: Record<string, string | number | boolean | null>;
}

export interface GetHandbookRowsRequest {
    offset: number | null;
}

export interface HandbookRow {
    id: string;
    values: Record<
        string,
        string | number | boolean | null | AstushaUserPreview
    >;
    createdById: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetHandbookRowsResponse {
    items: HandbookRow[];
    nextOffset: number | null;
}

export interface UpdatedHandbookRow {
    id: string;
    values: Record<
        string,
        string | number | boolean | null | AstushaUserPreview
    >;
}

export interface UpdateHandbookRowsRequest {
    rows: UpdatedHandbookRow[];
}

export interface DeleteOrCloneHandbookRowsRequest {
    rowIds: string[];
}

export interface EditHandbookDescriptionRequest {
    description: string;
}

export interface EditHandbookAttributesRequest {
    columns: (HandbookAttribute | HandbookColumnResponse)[];
}

export interface HandbookFiltersCounts {
    all: number;
    mine: number;
    available: number;
    favorites: number;
}

export interface HanbookFavoriteStatus {
    isFavorite: boolean;
}
