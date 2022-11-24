import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {
  private _baseUrl: string = environment.usersApiBaseUrl;
  constructor(private _httpClient: HttpClient) { }

  public register(user: User): Observable<Object> {
    return this._httpClient.post(`${this._baseUrl}/${environment.registerRoute}`, user);
  }

  public login(user: User): Observable<Object> {
    return this._httpClient.post(`${this._baseUrl}/${environment.loginRoute}`, user);
  }
}
