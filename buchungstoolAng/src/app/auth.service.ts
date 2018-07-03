import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	private mRegisterUrl = "http://localhost/api/login/server.php"

	constructor(private _http: Http) { }

	registerUser(_user) {
		let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

		return this._http.post(
			this.mRegisterUrl, 
			_user,
			options
		).pipe(
			map(res => res.json())
		);
	}
}
