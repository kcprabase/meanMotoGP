import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersDataService } from '../users-data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  constructor(private _registerFormBuilder: FormBuilder, private _userService: UsersDataService) { }

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
      next: (response) => { },
      error: () => { },
      complete: () => { }
    });
  }

}
