import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Race } from '../models/race.model';
import { RacesDataService } from '../services/races-data.service';

@Component({
  selector: 'app-race-form',
  templateUrl: './race-form.component.html',
  styleUrls: ['./race-form.component.css']
})
export class RaceFormComponent implements OnInit {

  @ViewChild(NgForm) raceForm!: NgForm;
  race: Race = {} as Race;
  method: string = environment.postMethod;
  raceId!: string;

  constructor(private _raceService: RacesDataService,
    private _router: Router, private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.raceId = this._route.snapshot.params[environment.raceIdParam];
    if (this.raceId) {
      this.method = environment.putMethod;
      this._raceService.getRace(this.raceId).subscribe(race => {
        this.race = race;
      });
    }
  }

  onSubmit(): void {
    if (this.method == environment.postMethod) {
      this.addRace();
    } else if (this.method ==  environment.putMethod) {
      this.updateRace();
    }
  }

  addRace(): void {
    this._raceService.addRace(this.raceForm.value as Race).subscribe((race: Race) => {
      if (race._id) {
        this._router.navigate([environment.racesRoute, race._id]);
      }
    });
  }

  updateRace(): void {
    this._raceService.updateRace(this.raceId, this.raceForm.value as Race).subscribe((race: any) => {
      this._router.navigate([environment.racesRoute, this.raceId]);
    });
  }

}
