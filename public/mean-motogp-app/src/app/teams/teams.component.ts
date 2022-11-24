import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Race } from '../models/race.model';
import { Team } from '../models/team.model';
import { AuthenticationService } from '../services/authentication.service';
import { RacesDataService } from '../services/races-data.service';
import { TeamsDataService } from '../services/teams-data.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams!: Team[];
  race!: Race;
  offset: number = 0;
  count: number = 5;
  nextDisabled: boolean = false;
  get isLoggedIn(): boolean {
    return this._authService.isLoggedIn;
  }

  get raceId(): string {
    return this._route.snapshot.params["raceId"];
  }
  // private get teamId(): string {
  //   return this._route.snapshot.params["teamId"];
  // }

  constructor(private _teamService: TeamsDataService,
    private _raceService: RacesDataService,
    private _route: ActivatedRoute,
    private _router: Router, private _authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.getTeams();
    this.getRace();
  }

  onUpdateClick(raceId: string): void {
    this._router.navigate(['races', 'edit', raceId]);
  }
  onDeleteClick(raceId: string, teamId: string): void {
    this._teamService.deleteTeam(raceId, teamId).subscribe((res: any) => {
      this.getTeams();
    });
  }

  private fillTeams(teams: Team[]) {
    if (!teams || teams.length == 0) {
      this.nextDisabled = true;
      this.offsetStepback();
    } else {
      console.log("there");
      this.teams = teams;
      this.nextDisabled = false;
    }
  }

  getTeams(): void {
    this._teamService.getTeams(this.raceId, this.offset, this.count).subscribe({
      next: (races) => this.fillTeams(races),
      error: (error) => {
        this.fillTeams([]); console.log(error);
      }
    });
  }

  getRace(): void {
    this._raceService.getRace(this.raceId).subscribe({
      next: (race) => this.race = race,
      error: (error) => {
        this.race = {} as Race;
      }
    });
  }

  offsetStepback() {
    this.offset = Math.max(0, this.offset - this.count);
  }

  prev(): void {
    this.offsetStepback();
    this.getTeams();
  }

  next(): void {
    this.offset = this.offset + this.count;
    this.getTeams();
  }

}
