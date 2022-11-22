import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms'
import { UrlSegmentGroup } from '@angular/router';
import { UsersDataService } from '../users-data.service';

class Credentials {
  #username!: string;
  #password!: string;

  set username(username: string) {
    this.#username = username;
  }

  get username(): string {
    return this.#username;
  }

  set password(password: string) {
    this.#password = password;
  }

  get password(): string {
    return this.#password;
  }

  constructor(username: string, password: string) {
    this.#username = username;
    this.#password = password;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild(NgForm) loginForm!: NgForm;
  user: Credentials = new Credentials("myUsername", "mypassword");
  constructor(private _userService: UsersDataService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log("ng form value", this.loginForm.value);
    this._userService.login(this.loginForm.value).subscribe({
      next: (registeredUser) => {
        console.log("user logged in", registeredUser);
      },
      error: (error) => {
        console.log("login error", error);
      },
      complete: () => { }
    });
  }
}

