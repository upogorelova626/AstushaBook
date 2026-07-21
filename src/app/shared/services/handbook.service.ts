import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {CreateHandbookRequest, Handbook} from '../interfaces';
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
}
