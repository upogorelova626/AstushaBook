import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {AstushaUser} from '../../../shared/interfaces';
import {Observable, tap} from 'rxjs';
import {UserService} from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly userService = inject(UserService);

    private readonly astushaIdApiUrl = 'http://localhost:3002/auth/refresh';

    refresh(): Observable<AstushaUser> {
        return this.http
            .post<AstushaUser>(this.astushaIdApiUrl, null, {
                withCredentials: true
            })
            .pipe(
                tap(user => {
                    this.userService.setCurrentUser(user);
                })
            );
    }
}
