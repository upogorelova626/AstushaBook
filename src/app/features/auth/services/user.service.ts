import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {AstushaUser} from '../../../shared/interfaces';
import {BehaviorSubject, Observable, tap} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http = inject(HttpClient);

    private readonly astushaIdApiUrl = 'http://localhost:3002/users/me';

    private readonly currentUserSubject =
        new BehaviorSubject<AstushaUser | null>(null);

    readonly currentUser$ = this.currentUserSubject.asObservable();

    getMe(): Observable<AstushaUser> {
        return this.http
            .get<AstushaUser>(`${this.astushaIdApiUrl}`, {
                withCredentials: true
            })
            .pipe(
                tap(user => {
                    this.setCurrentUser(user);
                })
            );
    }

    setCurrentUser(user: AstushaUser) {
        this.currentUserSubject.next(user);
    }

    clearCurrentUser(): void {
        this.currentUserSubject.next(null);
    }
}
