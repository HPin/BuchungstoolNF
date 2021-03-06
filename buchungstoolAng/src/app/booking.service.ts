import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Buchung } from './buchung';
import { AppConstants } from './app-constants';


@Injectable({
  providedIn: 'root'
})
export class BookingService {

    baseURL: string;

	// We need Http to talk to a remote server.
    constructor(private _http : Http){ 
        this.baseURL = AppConstants.baseURL;
    }


    readBookings() : Observable<Buchung[]> {
        return this._http
            .get(this.baseURL + "/buchung/read.php")
            .pipe(
                map(res => res.json())
            );
    }

    readBookingsByDate(_month: number, _year: number) {
        return this._http
            .get(this.baseURL + "/buchung/read_month.php?year="+_year+"&month="+_month)
            .pipe(
                map(res => res.json())
            );
    }

    // Get a product details from remote server.
    readOneBooking(id: number): Observable<Buchung>{
        return this._http
            .get(this.baseURL + "/buchung/read_one.php?id="+id)
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
            this.baseURL + "/buchung/create.php",
            _booking,
            options
        ).pipe(
            map(res => res.json())
        );
    }
}
