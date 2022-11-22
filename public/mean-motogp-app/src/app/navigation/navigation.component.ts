import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  get isLoggedIn(): boolean {
    return this._authService.isLoggedIn;
  }
  constructor(private _authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    this._authService.logout();
    this.router.navigate([""]);
  }

}
