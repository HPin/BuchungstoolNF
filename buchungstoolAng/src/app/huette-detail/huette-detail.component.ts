import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Huette }         from '../huette';
import { HuetteService }  from '../huette.service';

@Component({
  selector: 'app-huette-detail',
  templateUrl: './huette-detail.component.html',
  styleUrls: [ './huette-detail.component.css' ],
  providers: [HuetteService]
})
export class HuetteDetailComponent implements OnInit{
 
    huette: Huette;
    
    // initialize product service
    constructor(
        private _huetteService: HuetteService,
        private _location: Location,
        private _router: Router,
        private _route: ActivatedRoute
    ){}
 
    // call the record when 'huetteID' was changed
    ngOnInit(){
        this.getHuette();
    }

    goBack(): void {
        this._location.back();
    }

    // redirect to booking component
     openBookingFor(_id) {
        this._router.navigate(["/booking/" + _id]);
     }

    getHuette(): void {
        // get huetteID where the booking corresponds to ... '+' operator converts string to a number
        const huetteUrlID = +this._route.snapshot.paramMap.get('id');
        this._huetteService.readOneHuette(huetteUrlID)
            .subscribe(huette => this.huette=huette);
    }
}