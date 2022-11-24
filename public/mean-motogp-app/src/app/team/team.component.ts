import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from '../models/team.model';
import { TeamsDataService } from '../services/teams-data.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  team!: Team;
  get teamId(): string {
    return this._route.snapshot.params["teamId"];
  }
  get raceId(): string {
    return this._route.snapshot.params["raceId"];
  }
  constructor(private _teamService: TeamsDataService,
    private _router: Router,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._teamService.getTeam(this.raceId, this.teamId).subscribe(team => {
      this.team = team;
    });
  }

  delete(): void {
    this._teamService.deleteTeam(this.raceId, this.teamId).subscribe((res: any) => {
      this._router.navigate(["races", this.raceId, "teams"]);
    });
  }

}
