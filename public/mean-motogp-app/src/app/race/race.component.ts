import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Race } from '../models/race.model';
import { RacesDataService } from '../services/races-data.service';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})
export class RaceComponent implements OnInit {
  race!: Race;
  get raceId(): string {
    return this._route.snapshot.params["raceId"];
  }
  constructor(private _raceService: RacesDataService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    this._raceService.getRace(this.raceId).subscribe(race => {
      this.race = race;
    });
  }

  delete(): void {
    this._raceService.deleteRace(this.raceId).subscribe((res: any) => {
      this._router.navigate(["races"]);
    });
  }

}
