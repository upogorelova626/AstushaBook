import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {AstushaUserPreview, UsersSearchRequest} from '../interfaces';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly http = inject(HttpClient);

    private readonly astushaBookApiUrl = 'http://localhost:3001/users/search';

    searchUsers(payload: UsersSearchRequest): Observable<AstushaUserPreview[]> {
        return this.http.post<AstushaUserPreview[]>(
            `${this.astushaBookApiUrl}`,
            payload,
            {withCredentials: true}
        );
    }
}
