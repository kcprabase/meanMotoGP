import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { UsersDataService } from '../services/users-data.service';

// class Credentials {
//   #username!: string;
//   #password!: string;

//   set username(username: string) {
//     this.#username = username;
//   }

//   get username(): string {
//     return this.#username;
//   }

//   set password(password: string) {
//     this.#password = password;
//   }

//   get password(): string {
//     return this.#password;
//   }

//   constructor(username: string, password: string) {
//     this.#username = username;
//     this.#password = password;
//   }
// }

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
        console.log("here");

        if (errorOccured) {
          this.user.reset();
          alert("Login unsuccessful");
        }
      }
    });
  }
}
