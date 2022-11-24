import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../services/authentication.service';
import { UsersDataService } from '../services/users-data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage!: string | null;
  successMessage!: string | null;
  constructor(private _registerFormBuilder: FormBuilder, private _userService: UsersDataService,
    private _authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this._registerFormBuilder.group({
      name: "",
      username: "",
      password: "",
      passwordRepeat: ""
    });
  }

  onSubmit(): void {
    this._userService.register(this.registerForm.value).subscribe({
      next: (token: any) => {
        let result: boolean = this._authService.processToken(token.token);
        if (result) {
          this.successMessage = environment.userRegistered;
          this.errorMessage = null;
          setTimeout(() => {
            this.router.navigate([""]);
          }, 3000);
        } else {
          this.successMessage = null;
          this.errorMessage = environment.tokenNotFound;
        }
      },
      error: (error) => {
        this.successMessage = null;
        this.errorMessage = environment.userRegistrationFailed;
      },
      complete: () => { }
    });
  }

}
