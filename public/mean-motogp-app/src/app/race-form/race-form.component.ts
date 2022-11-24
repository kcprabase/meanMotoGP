import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  method: string = "post";
  raceId!: string;

  constructor(private _raceService: RacesDataService,
    private _router: Router, private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.raceId = this._route.snapshot.params["raceId"];
    if (this.raceId) {
      this.method = "put";
      this._raceService.getRace(this.raceId).subscribe(race => {
        this.race = race;
      });
    }
  }

  onSubmit(): void {
    if (this.method == "post") {
      this.addRace();
    } else if (this.method == "put") {
      this.updateRace();
    }
  }

  addRace(): void {
    this._raceService.addRace(this.raceForm.value as Race).subscribe((race: Race) => {
      if (race._id) {
        this._router.navigate(['races', race._id]);
      }
    });
  }

  updateRace(): void {
    this._raceService.updateRace(this.raceId, this.raceForm.value as Race).subscribe((race: any) => {
      this._router.navigate(['races', this.raceId]);
    });
  }

}
