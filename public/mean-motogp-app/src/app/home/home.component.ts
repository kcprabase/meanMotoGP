import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
