import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
    AddHandbookRowRequest,
    CreateHandbookRequest,
    GetHandbooksRequest,
    GetHandbooksResponse,
    GetHandbookRowsRequest,
    Handbook,
    GetHandbookRowsResponse
} from '../interfaces';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HandbookService {
    private readonly http = inject(HttpClient);

    private readonly astushaBookApiUrl = 'http://localhost:3001/handbooks';

    createHandbook(payload: CreateHandbookRequest): Observable<Handbook> {
        return this.http.post<Handbook>(`${this.astushaBookApiUrl}`, payload, {
            withCredentials: true
        });
    }

    getHandbooksPreviews(
        payload: GetHandbooksRequest
    ): Observable<GetHandbooksResponse> {
        return this.http.post<GetHandbooksResponse>(
            `${this.astushaBookApiUrl}/search`,
            payload,
            {
                withCredentials: true
            }
        );
    }

    getHandbook(id: string): Observable<Handbook> {
        return this.http.get<Handbook>(`${this.astushaBookApiUrl}/${id}`, {
            withCredentials: true
        });
    }

    deleteHandbook(id: string) {
        return this.http.delete(`${this.astushaBookApiUrl}/${id}`, {
            withCredentials: true
        });
    }

    addRow(handbookId: string, payload: AddHandbookRowRequest) {
        return this.http.post(
            `${this.astushaBookApiUrl}/${handbookId}/rows`,
            payload,
            {
                withCredentials: true
            }
        );
    }

    getHandbookRows(
        handbookId: string,
        payload: GetHandbookRowsRequest
    ): Observable<GetHandbookRowsResponse> {
        return this.http.post<GetHandbookRowsResponse>(
            `${this.astushaBookApiUrl}/${handbookId}/rows/search`,
            payload,
            {
                withCredentials: true
            }
        );
    }
}
