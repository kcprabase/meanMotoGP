import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private _isLoggedIn: boolean = false;
    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }
    private set isLoggedIn(isLoggedIn: boolean) {
        this._isLoggedIn = isLoggedIn;
    }
    get token(): string {
        return localStorage.getItem("token") || "";
    }
    private set token(token: string) {
        localStorage.setItem("token", token);
    }
    get name(): string {
        return this.decodeToken(this.token).name;
    }
    get bearerToken(): string {
        return "BEARER " + this.token;
    }

    constructor(private jwtHelper: JwtHelperService) {
        this.processToken(this.token);
    }

    public processToken(token: any): boolean {
        if (!this.isTokenExpired(token)) {
            this.isLoggedIn = true;
            this.token = token;
            return true;
        } else {
            this.isLoggedIn = false;
            return false;
        }
    }

    private decodeToken(token: string): any {
        const payload = this.jwtHelper.decodeToken(token);
        return payload;
    }
    private isTokenExpired(token: string): boolean {
        return this.jwtHelper.isTokenExpired(token);
    }

    public logout(): void {
        localStorage.clear();
        this.isLoggedIn = false;
    }

}
