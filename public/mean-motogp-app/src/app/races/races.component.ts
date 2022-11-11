import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  count: number = 10;

  constructor(private _raceService: RacesDataService, private _router: Router) { }

  ngOnInit(): void {
    this.getRaces();
  }
  onUpdateClick(raceId: string): void {
    this._router.navigate(['races', 'edit', raceId]);
  }
  onDeleteClick(raceId: string): void {
    this._raceService.deleteRace(raceId).subscribe((res: any) => {
      console.log(res);
      this.getRaces();
    });
  }

  getRaces(): void {
    this._raceService.getRaces(this.offset, this.count).subscribe(races => {
      this.races = races;
    });
  }

}
