import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Huette } from './huette';
//import { HUETTEN } from './mock-huetten';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HuetteService {

	 // We need Http to talk to a remote server.
    constructor(private _http : Http){ }
 
    // Get list of products from remote server.
    readHuetten(): Observable<Huette[]>{
        return this._http
            .get("http://localhost/api/huette/read.php")
            .pipe(
            	map(res => res.json())
            );
    }
 
   // Get a product details from remote server.
    readOneHuette(id): Observable<Huette>{
        return this._http
            .get("http://localhost/api/huette/read_one.php?id="+id)
            .pipe(
                map(res => res.json())
            );
    }

	/*
  constructor() { }

  getHuetten(): Observable<Huette[]> {
  	return of(HUETTEN);
  }

  getHuette(id: number): Observable<Huette> {
  	return of(HUETTEN.find(huette => huette.id === id));
  }
  */
}

