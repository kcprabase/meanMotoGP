import { Component, OnInit } from '@angular/core';
import { Race } from '../models/race.model';
import { RacesDataService } from '../services/races-data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  count: number = 10;
  offset: number = 0;
  searchText: string = "";
  races!: Race[];
  constructor(private _raceService: RacesDataService) { }

  ngOnInit(): void {
  }

  private fillRaces(races: Race[]) {
    this.races = races;

  }

  search(): void {
    this._raceService.getRaces(this.offset, this.count, this.searchText).subscribe({
      next: (races) => this.fillRaces(races),
      error: (error) => {
        this.fillRaces([]); console.log(error);
      }
    });
  }

}
