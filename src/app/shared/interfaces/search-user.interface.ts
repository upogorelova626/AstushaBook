export interface UsersSearchRequest {
    query: string;
}

export interface AstushaUserPreview {
    id: string;
    login: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
}
