import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { UsersDataService } from '../services/users-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild(NgForm) loginForm!: NgForm;
  user: User = {} as User;
  constructor(private _userService: UsersDataService, private _authService: AuthenticationService,
    private _router: Router) { }

  ngOnInit(): void {
  }


  onSubmit(): void {
    let errorOccured: boolean = false;
    this._userService.login(this.loginForm.value).subscribe({
      next: (token: any) => {
        let result: boolean = this._authService.processToken(token.token);
        if (result) {
          this._router.navigate([""]);
        } else {
          errorOccured = true;
        }
      },
      error: (error) => {
        errorOccured = true;
      },
      complete: () => {
        if (errorOccured) {
          this.user.reset();
          alert(environment.loginUnsuccess);
        }
      }
    });
  }
}
