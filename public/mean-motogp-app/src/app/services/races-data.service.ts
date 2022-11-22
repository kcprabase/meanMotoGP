import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Race } from '../models/race.model';

@Injectable({
  providedIn: 'root'
})
export class RacesDataService {
  private _baseUrl: string;
  constructor(private _http: HttpClient) {
    this._baseUrl = "http://localhost:3000/api";
  }

  public getRaces(offset: number, count: number): Observable<Race[]> {
    return this._http
      .get<Race[]>(`${this._baseUrl}/races?offset=${offset}&count=${count}`);
  }

  public getRace(raceId: string): Observable<Race> {
    return this._http
      .get<Race>(`${this._baseUrl}/races/${raceId}`);
  }

  public deleteRace(raceId: string): any {
    // const headers = { 'Access-Control-Allow-Origin': '*' };
    return this._http.delete<void>(`${this._baseUrl}/races/${raceId}`
      // , { headers: headers }
    );
  }

  public addRace(race: Race): Observable<Race> {
    return this._http.post<Race>(`${this._baseUrl}/races`, race);
  }

  public updateRace(raceId: string, race: Race): Observable<Race> {
    console.log("race", race, "raceId", raceId);
    return this._http.put<Race>(`${this._baseUrl}/races/${raceId}`, race);
  }
}
