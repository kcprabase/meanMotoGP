import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from '../models/team.model';
import { TeamsDataService } from '../services/teams-data.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {

  @ViewChild(NgForm) teamForm!: NgForm;
  team: Team = {} as Team;
  method: string = "post";
  get teamId(): string {
    return this._route.snapshot.params["teamId"];
  }
  get raceId(): string {
    return this._route.snapshot.params["raceId"];
  }

  constructor(private _teamService: TeamsDataService,
    private _router: Router, private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.teamId) {
      this.method = "put";
      this._teamService.getTeam(this.raceId, this.teamId).subscribe(team => {
        this.team = team;
      });
    }
  }

  onSubmit(): void {
    if (this.method == "post") {
      this.addTeam();
    } else if (this.method == "put") {
      this.updateTeam();
    }
  }

  addTeam(): void {
    this._teamService.addTeam(this.raceId, this.team).subscribe((team: Team) => {
      if (team._id) {
        this._router.navigate(['races', this.raceId, 'teams', team._id]);
      }
    });
  }

  updateTeam(): void {
    this._teamService.updateTeam(this.raceId, this.teamId, this.team).subscribe((race: any) => {
      this._router.navigate(['races', this.raceId, 'teams', this.teamId]);
    });
  }
}
