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
import { ProfileComponent } from './profile/profile.component';
import { environment } from 'src/environments/environment';
import { EnvironmentPipe } from './environment.pipe';
import { SearchComponent } from './search/search.component';

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
    TeamFormComponent,
    ProfileComponent,
    EnvironmentPipe,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: environment.homeRoute,
        component: HomeComponent
      },
      {
        path: environment.racesRoute,
        component: RacesComponent,
      },
      {
        path: environment.racesAddRoute,
        component: RaceFormComponent
      },
      {
        path: environment.racesRaceEditRoute,
        component: RaceFormComponent
      },
      {
        path: environment.raceDetailRoute,
        component: RaceComponent
      },
      {
        path: environment.raceTeamListRoute,
        component: TeamsComponent
      },
      {
        path: environment.raceTeamAddRoute,
        component: TeamFormComponent
      },
      {
        path: environment.raceTeamEditRoute,
        component: TeamFormComponent
      },
      {
        path: environment.teamDetailRoute,
        component: TeamComponent
      },
      {
        path: environment.registerRoute,
        component: RegisterComponent
      },
      {
        path: environment.loginRoute,
        component: LoginComponent
      },
      {
        path: environment.profileROute,
        component: ProfileComponent
      },
      {
        path: environment.searchRoute,
        component: SearchComponent
      },
      {
        path: environment.pageNotFoundRoute,
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
