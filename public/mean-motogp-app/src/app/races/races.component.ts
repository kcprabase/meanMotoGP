import { Component, OnInit } from '@angular/core';
import { Race } from '../models/race.model';
import { AuthenticationService } from '../services/authentication.service';
import { RacesDataService } from '../services/races-data.service';

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {
  races!: Race[];
  offset: number = 0;
  count: number = 5;
  nextDisabled: boolean = false;
  get isLoggedIn(): boolean {
    return this._authService.isLoggedIn;
  }

  constructor(private _raceService: RacesDataService,
     private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getRaces();
  }

  private fillRaces(races: Race[]) {
    if (!races || races.length == 0) {
      this.nextDisabled = true;
      this.offsetStepback();
    } else {
      this.races = races;
      this.nextDisabled = false;
    }
  }

  getRaces(): void {
    this._raceService.getRaces(this.offset, this.count).subscribe({
      next: (races) => this.fillRaces(races),
      error: (error) => {
        this.fillRaces([]); console.log(error);
      }
    });
  }

  offsetStepback() {
    this.offset = Math.max(0, this.offset - this.count);
  }

  prev(): void {
    this.offsetStepback();
    this.getRaces();
  }

  next(): void {
    this.offset = this.offset + this.count;
    this.getRaces();
  }

}
