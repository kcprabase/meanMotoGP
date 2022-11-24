import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Race } from '../models/race.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RacesDataService {
  private _baseUrl: string = environment.racesApiBaseUrl;
  constructor(private _http: HttpClient) {
  }

  public getRaces(offset: number, count: number): Observable<Race[]> {
    return this._http
      .get<Race[]>(`${this._baseUrl}?${environment.offset}=${offset}&${environment.count}=${count}`);
  }

  public getRace(raceId: string): Observable<Race> {
    return this._http
      .get<Race>(`${this._baseUrl}/${raceId}`);
  }

  public deleteRace(raceId: string): any {
    return this._http.delete<void>(`${this._baseUrl}/${raceId}`);
  }

  public addRace(race: Race): Observable<Race> {
    return this._http.post<Race>(`${this._baseUrl}`, race);
  }

  public updateRace(raceId: string, race: Race): Observable<Race> {
    return this._http.put<Race>(`${this._baseUrl}/${raceId}`, race);
  }
}
