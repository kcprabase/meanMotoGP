import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { RacesComponent } from './races/races.component';
import { RaceComponent } from './race/race.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RaceFormComponent } from './race-form/race-form.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { TokenInterceptor } from './interceptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavigationComponent,
    HomeComponent,
    RacesComponent,
    RaceComponent,
    ErrorPageComponent,
    RegisterComponent,
    LoginComponent,
    RaceFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: "",
        component: HomeComponent
      },
      {
        path: "races",
        component: RacesComponent,
      },
      {
        path: "races/add",
        component: RaceFormComponent
      },
      {
        path: "races/edit/:raceId",
        component: RaceFormComponent
      },
      {
        path: "races/:raceId",
        component: RaceComponent
      },
      {
        path: "register",
        component: RegisterComponent
      },
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "**",
        component: ErrorPageComponent
      }
    ])
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
