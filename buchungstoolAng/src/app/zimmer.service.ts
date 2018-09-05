import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Zimmer } from './zimmer';
import { Zimmerkategorie } from './zimmerkategorie';

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

    // Get details for one specific room
    readOneZimmer(_id: number): Observable<Zimmer>{
        return this._http
            .get("http://localhost/api/zimmer/read_one.php?id="+_id)
            .pipe(
                map(res => res.json())
            );
    }

}
