import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  get isLoggedIn(): boolean {
    return this._authService.isLoggedIn;
  }
  get name(): string {
    return this._authService.name;
  }
  constructor(private _authService: AuthenticationService) { }

  ngOnInit(): void {
  }

}
