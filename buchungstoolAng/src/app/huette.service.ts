import { Injectable } from '@angular/core';

import { Huette } from './hero';
import { HUETTEN } from './mock-huetten';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HuetteService {

  constructor() { }

  getHuetten(): Observable<Huette[]> {
  	return of(HUETTEN);
  }

  getHuette(id: number): Observable<Huette> {
  	return of(HUETTEN.find(hero => hero.id === id));
  }
}

