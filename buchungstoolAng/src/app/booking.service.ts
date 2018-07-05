import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Buchung } from './buchung';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

	// We need Http to talk to a remote server.
    constructor(private _http : Http){ }


    readBookings() : Observable<Buchung[]> {
        return this._http
            .get("http://localhost/api/buchung/read.php")
            .pipe(
                map(res => res.json())
            );
    }

    // Get a product details from remote server.
    readOneBooking(id: number): Observable<Buchung>{
        return this._http
            .get("http://localhost/api/buchung/read_one.php?id="+id)
            .pipe(
                map(res => res.json())
            );
    }


  	// Send product data to remote server to create it.
    createBooking(_booking): Observable<Buchung>{
        console.log(_booking)
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
