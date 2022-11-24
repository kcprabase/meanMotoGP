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
import { TeamsComponent } from './teams/teams.component';
import { TeamComponent } from './team/team.component';
import { TeamFormComponent } from './team-form/team-form.component';

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
    RaceFormComponent,
    TeamsComponent,
    TeamComponent,
    TeamFormComponent
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
        path: "races/:raceId/edit",
        component: RaceFormComponent
      },
      {
        path: "races/:raceId",
        component: RaceComponent
      },
      {
        path: "races/:raceId/teams",
        component: TeamsComponent
      },
      {
        path: "races/:raceId/teams/add",
        component: TeamFormComponent
      },
      {
        path: "races/:raceId/teams/:teamId/edit",
        component: TeamFormComponent
      },
      {
        path: "races/:raceId/teams/:teamId",
        component: TeamComponent
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
