import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Buchung } from './buchung';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

	// We need Http to talk to a remote server.
    constructor(private _http : Http){ }


  	// Send product data to remote server to create it.
    createBooking(_booking): Observable<Buchung>{
     
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(
            "http://localhost/api/buchung/create.php",
            _booking,
            options
        ).pipe(
            map(res => res.json())
        );
    }
}
