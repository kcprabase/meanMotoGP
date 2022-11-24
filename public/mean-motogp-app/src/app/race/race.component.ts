import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Race } from '../models/race.model';
import { AuthenticationService } from '../services/authentication.service';
import { RacesDataService } from '../services/races-data.service';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})
export class RaceComponent implements OnInit {
  race!: Race;
  racesRouteRelative: string = environment.racesRouteRelative;
  get raceId(): string {
    return this._route.snapshot.params[environment.raceIdParam];
  }
  get isLoggedIn(): boolean {
    return this._authService.isLoggedIn;
  }
  constructor(private _raceService: RacesDataService, private _route: ActivatedRoute, private _router: Router, private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this._raceService.getRace(this.raceId).subscribe(race => {
      this.race = race;
    });
  }

  delete(): void {
    this._raceService.deleteRace(this.raceId).subscribe((res: any) => {
      this._router.navigate([environment.racesRoute]);
    });
  }

}
