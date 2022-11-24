import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamsDataService {
  private _baseUrl: string = environment.apiBaseUrl + '/races';
  constructor(private _http: HttpClient) {
  }

  public getTeams(raceId: string, offset: number, count: number): Observable<Team[]> {
    return this._http
      .get<Team[]>(`${this._baseUrl}/${raceId}/teams?offset=${offset}&count=${count}`);
  }

  public getTeam(raceId: string, teamId: string): Observable<Team> {
    return this._http
      .get<Team>(`${this._baseUrl}/${raceId}/teams/${teamId}`);
  }

  public deleteTeam(raceId: string, teamId: string): any {
    return this._http.delete<void>(`${this._baseUrl}/${raceId}/teams/${teamId}`);
  }

  public addTeam(raceId: string, team: Team): Observable<Team> {
    return this._http.post<Team>(`${this._baseUrl}/${raceId}/teams`, team);
  }

  public updateTeam(raceId: string, teamId: string, team: Team): Observable<Team> {
    return this._http.put<Team>(`${this._baseUrl}/${raceId}/teams/${teamId}`, team);
  }
}
