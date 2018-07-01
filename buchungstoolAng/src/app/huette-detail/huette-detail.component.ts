import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Huette }         from '../huette';
import { HuetteService }  from '../huette.service';

@Component({
  selector: 'app-huette-detail',
  templateUrl: './huette-detail.component.html',
  styleUrls: [ './huette-detail.component.css' ],
  providers: [HuetteService]
})
export class HuetteDetailComponent implements OnChanges {
    /*
        @Output will tell the parent component (AppComponent)
        that an event has happened (via .emit(), see readProducts() method below)
    */
    @Output() show_read_huetten_event = new EventEmitter();
 
    // @Input means it will accept value from parent component (AppComponent)
    @Input() huetteID;
 
    huette: Huette;
 
    // initialize product service
    constructor(private huetteService: HuetteService){}
 
    // user clicks the 'read products' button
    readHuetten(){
        this.show_read_huetten_event.emit({ title: "Read Huetten" });
    }
 
    // call the record when 'huetteID' was changed
    ngOnChanges(){
        this.huetteService.readOneHuette(this.huetteID)
            .subscribe(huette => this.huette=huette);
    }
}