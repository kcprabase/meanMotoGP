import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
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
  method: string = environment.postMethod;
  get teamId(): string {
    return this._route.snapshot.params[environment.teamIdParam];
  }
  get raceId(): string {
    return this._route.snapshot.params[environment.raceIdParam];
  }

  constructor(private _teamService: TeamsDataService,
    private _router: Router, private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.teamId) {
      this.method = environment.putMethod;
      this._teamService.getTeam(this.raceId, this.teamId).subscribe(team => {
        this.team = team;
      });
    }
  }

  onSubmit(): void {
    if (this.method == environment.postMethod) {
      this.addTeam();
    } else if (this.method == environment.putMethod) {
      this.updateTeam();
    }
  }

  addTeam(): void {
    this._teamService.addTeam(this.raceId, this.team).subscribe((team: Team) => {
      if (team._id) {
        this._router.navigate([environment.racesRoute, this.raceId, environment.teamsRoute, team._id]);
      }
    });
  }

  updateTeam(): void {
    this._teamService.updateTeam(this.raceId, this.teamId, this.team).subscribe((race: any) => {
      this._router.navigate([environment.racesRoute, this.raceId, environment.teamsRoute, this.teamId]);
    });
  }
}
