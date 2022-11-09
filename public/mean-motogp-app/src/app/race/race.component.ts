import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Race } from '../models/race.model';
import { RacesDataService } from '../races-data.service';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})
export class RaceComponent implements OnInit {
  race!: Race;
  constructor(private _raceService: RacesDataService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    const raceId: string = this._route.snapshot.params["raceId"];
    this._raceService.getRace(raceId).subscribe(race => {
      this.race = race;
    });
  }

}
