import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Team } from '../models/team.model';
import { AuthenticationService } from '../services/authentication.service';
import { TeamsDataService } from '../services/teams-data.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  team!: Team;
  racesRouteRelative: string = environment.racesRouteRelative;
  teamsRoute: string = environment.teams;
  get teamId(): string {
    return this._route.snapshot.params[environment.teamIdParam];
  }
  get raceId(): string {
    return this._route.snapshot.params[environment.raceIdParam];
  }
  get isLoggedIn(): boolean {
    return this._authService.isLoggedIn;
  }
  constructor(private _teamService: TeamsDataService,
    private _router: Router, private _authService: AuthenticationService,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._teamService.getTeam(this.raceId, this.teamId).subscribe(team => {
      this.team = team;
    });
  }

  delete(): void {
    this._teamService.deleteTeam(this.raceId, this.teamId).subscribe((res: any) => {
      this._router.navigate([environment.racesRoute, this.raceId, environment.teamsRoute]);
    });
  }

}
