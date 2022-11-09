import { Component, OnInit } from '@angular/core';
import { Race } from '../models/race.model';
import { RacesDataService } from '../races-data.service';

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {
  races!: Race[];
  offset: number = 0;
  count: number = 5;

  constructor(private _raceService: RacesDataService) { }

  ngOnInit(): void {
    this._raceService.getRaces(this.offset, this.count).subscribe(races => {
      this.races = races;
    });
  }

}
