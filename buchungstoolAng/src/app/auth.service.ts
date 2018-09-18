import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { AppConstants } from './app-constants';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
    baseURL: string;
	username: string;
	firstname: string;
	lastname: string;
	isLoggedIn = false;
	uuid: string;

	// store the URL so we can redirect after logging in
	redirectUrl: string;


	constructor(private _http: Http) { 
		this.baseURL = AppConstants.baseURL;
	}

	isUserLoggedIn() {
		// attempt to "relogin" user if a session is found
		// the !! coerces an object to boolean...-> true if exists, false if: null, 0, undefined, ...
		if (!!localStorage.getItem('login')) {
			this.isLoggedIn = true;
			var tempData = JSON.parse(localStorage.getItem('login'));
			this.firstname = tempData.firstname;
			this.lastname = tempData.lastname;
			this.username = tempData.user;
			this.uuid = tempData.uuid;
		}

		return this.isLoggedIn;
	}
	
	loginUser(_user) {
		let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        //let data = 'username='+_user.username+'&password='+_user.password;

		return this._http.post(
			this.baseURL + "/login/login.php", 
			_user,
			options
		).pipe(
            map(res => res.json())
        );
	}

	saveUserData(_userData) {
		this.isLoggedIn = true;
		this.firstname = _userData.firstname;
		this.lastname = _userData.lastname;
		this.username = _userData.user;
		this.uuid = _userData.uuid;

		localStorage.setItem('login', JSON.stringify({
			firstname: this.firstname,
			lastname: this.lastname,
			username: this.username,
			uuid: this.uuid
		}));
	}

	logoutAndClear() {
		localStorage.removeItem('login');
		this.isLoggedIn = false;
		this.firstname = "";
		this.lastname = "";
		this.username = "";
		this.uuid = "";
		localStorage.clear();
	}

	getName() {
		return this.firstname + " " + this.lastname;
	}
	
}
