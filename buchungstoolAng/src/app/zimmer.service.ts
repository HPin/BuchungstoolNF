import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Zimmer } from './zimmer';

@Injectable({
  providedIn: 'root'
})
export class ZimmerService {

   constructor(private _http : Http){ }


    readZimmer() : Observable<Zimmer[]> {
        return this._http
            .get("http://localhost/api/zimmer/read.php")
            .pipe(
                map(res => res.json())
            );
    }

    // Get a product details from remote server.
    readOneZimmer(id: number): Observable<Zimmer>{
        return this._http
            .get("http://localhost/api/zimmer/read_one.php?id="+id)
            .pipe(
                map(res => res.json())
            );
    }

}
