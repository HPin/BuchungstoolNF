import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

	  isLoggedIn = false;

	  // store the URL so we can redirect after logging in
	  redirectUrl: string;

	  login(): Observable<boolean> {
	    return of(true).pipe(
	      delay(1000),
	      tap(val => this.isLoggedIn = true)
	    );
	  }

	  logout(): void {
	    this.isLoggedIn = false;
	  }


	constructor(private _http: Http) { }

	/*
	loginUser(_user) {
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        let data = 'username='+_user.username+'&password='+_user.password;

		return this._http.post(
			"http://localhost/api/login/login.php", 
			data,
			options
		).pipe(
            map(res => res.json())
        );
	}
	*/
}
