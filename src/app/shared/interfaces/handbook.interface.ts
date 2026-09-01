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

export enum HandbookListFilter {
    All = 'ALL',
    Mine = 'MINE',
    Available = 'AVAILABLE',
    Favorites = 'FAVORITES'
}

export type HandbookCellValue =
    | string
    | number
    | boolean
    | null
    | AstushaUserPreview;

export interface Reference {
    handbook: HandbookPreview | null;
    columnId: string | null;
}

export interface ReferenceValues {
    rowId: string;
    value: HandbookCellValue;
}

export interface ReferenceResponse extends Reference {
    values: ReferenceValues[];
}

export interface HandbookAttribute {
    name: string;
    type: HandbookColumnType;
    required: boolean;
    options: string[];
    reference: Reference | null;
}

export interface EditHandbookAttribute extends HandbookAttribute {
    id?: string;
}

export interface HandbookColumnResponse extends Omit<
    HandbookAttribute,
    'reference'
> {
    id: string;
    handbookId: string;
    position: number;
    createdAt: string;
    updatedAt: string;
    referenceColumnId: string | null;
    reference: ReferenceResponse | null;
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

export interface HandbookParticipant {
    handbookId: string;
    userId: string;
    addedAt: string;
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

export interface GetHandbooksRequest {
    name: string;
    tags: string[];
    filter: HandbookListFilter;
    offset?: number;
}

export interface GetHandbooksResponse {
    items: HandbookPreview[];
    nextOffset: number | null;
}

export interface HandbookFiltersCounts {
    all: number;
    mine: number;
    available: number;
    favorites: number;
}

export interface GetRecentlyViewedHandbooksRequest {
    ids: string[];
}

export interface HandbookRow {
    id: string;
    values: Record<string, HandbookCellValue>;
    createdById: string;
    createdAt: string;
    updatedAt: string;
}

export interface AddHandbookRowRequest {
    values: Record<string, HandbookCellValue>;
}

export interface GetHandbookRowsRequest {
    offset: number | null;
}

export interface GetHandbookRowsResponse {
    items: HandbookRow[];
    nextOffset: number | null;
}

export interface UpdatedHandbookRow {
    id: string;
    values: Record<string, HandbookCellValue>;
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
    columns: EditHandbookAttribute[];
}

export interface HanbookFavoriteStatus {
    isFavorite: boolean;
}
