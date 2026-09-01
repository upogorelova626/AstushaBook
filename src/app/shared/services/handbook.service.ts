import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
    AddHandbookRowRequest,
    CreateHandbookRequest,
    GetHandbooksRequest,
    GetHandbooksResponse,
    GetHandbookRowsRequest,
    Handbook,
    GetHandbookRowsResponse,
    HandbookRow,
    UpdateHandbookRowsRequest,
    DeleteOrCloneHandbookRowsRequest,
    EditHandbookDescriptionRequest,
    EditHandbookAttributesRequest,
    HandbookFiltersCounts,
    HanbookFavoriteStatus,
    HandbookPreview,
    GetRecentlyViewedHandbooksRequest
} from '../interfaces';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HandbookService {
    private readonly http = inject(HttpClient);

    private readonly astushaBookApiUrl = 'http://localhost:3001/handbooks';

    createHandbook(payload: CreateHandbookRequest): Observable<Handbook> {
        return this.http.post<Handbook>(`${this.astushaBookApiUrl}`, payload);
    }

    getHandbooksPreviews(
        payload: GetHandbooksRequest
    ): Observable<GetHandbooksResponse> {
        return this.http.post<GetHandbooksResponse>(
            `${this.astushaBookApiUrl}/search`,
            payload
        );
    }

    getHandbooksCount(): Observable<HandbookFiltersCounts> {
        return this.http.get<HandbookFiltersCounts>(
            `${this.astushaBookApiUrl}/filter-counts`
        );
    }

    getRecentlyViewedHandbooks(
        payload: GetRecentlyViewedHandbooksRequest
    ): Observable<HandbookPreview[]> {
        return this.http.post<HandbookPreview[]>(
            `${this.astushaBookApiUrl}/previews`,
            payload
        );
    }

    getHandbook(id: string): Observable<Handbook> {
        return this.http.get<Handbook>(`${this.astushaBookApiUrl}/${id}`);
    }

    editHandbookAttributes(
        id: string,
        payload: EditHandbookAttributesRequest
    ): Observable<Handbook> {
        return (
            this,
            this.http.patch<Handbook>(
                `${this.astushaBookApiUrl}/${id}/columns`,
                payload
            )
        );
    }

    deleteHandbook(id: string) {
        return this.http.delete(`${this.astushaBookApiUrl}/${id}`);
    }

    editHandbookDescription(
        id: string,
        payload: EditHandbookDescriptionRequest
    ): Observable<Handbook> {
        return this.http.patch<Handbook>(
            `${this.astushaBookApiUrl}/${id}/description`,
            payload
        );
    }

    addRow(
        handbookId: string,
        payload: AddHandbookRowRequest
    ): Observable<HandbookRow> {
        return this.http.post<HandbookRow>(
            `${this.astushaBookApiUrl}/${handbookId}/rows`,
            payload
        );
    }

    getHandbookRows(
        handbookId: string,
        payload: GetHandbookRowsRequest
    ): Observable<GetHandbookRowsResponse> {
        return this.http.post<GetHandbookRowsResponse>(
            `${this.astushaBookApiUrl}/${handbookId}/rows/search`,
            payload
        );
    }

    editHandbookRows(
        handbookId: string,
        payload: UpdateHandbookRowsRequest
    ): Observable<HandbookRow[]> {
        return this.http.put<HandbookRow[]>(
            `${this.astushaBookApiUrl}/${handbookId}/rows`,
            payload
        );
    }

    deleteHandbookRows(
        handbookId: string,
        payload: DeleteOrCloneHandbookRowsRequest
    ) {
        return this.http.delete(
            `${this.astushaBookApiUrl}/${handbookId}/rows`,

            {
                body: payload
            }
        );
    }

    cloneHandbookRows(
        handbookId: string,
        payload: DeleteOrCloneHandbookRowsRequest
    ): Observable<HandbookRow[]> {
        return this.http.post<HandbookRow[]>(
            `${this.astushaBookApiUrl}/${handbookId}/rows/duplicate`,
            payload
        );
    }

    editFavouriteStatus(
        handbookId: string,
        payload: HanbookFavoriteStatus
    ): Observable<HanbookFavoriteStatus> {
        return this.http.patch<HanbookFavoriteStatus>(
            `${this.astushaBookApiUrl}/${handbookId}/favorite`,
            payload
        );
    }
}
