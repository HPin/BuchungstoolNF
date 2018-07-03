import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HuetteService } from '../../huette.service';
import { Observable } from 'rxjs';
import { Huette } from '../../huette';
import { Router } from '@angular/router';

@Component({
  selector: 'app-read-huetten',
  templateUrl: './read-huetten.component.html',
  styleUrls: ['./read-huetten.component.css'],
  providers: [HuetteService]
})
export class ReadHuettenComponent implements OnInit {

  @Output() show_read_one_huette_event=new EventEmitter();

  // store list of products
  huetten: Huette[];

  // initialize productService to retrieve list products in the ngOnInit()
  constructor(private _huetteService: HuetteService,
              private _router: Router
  ){}

  // Read products from API.
  ngOnInit(){
      this._huetteService.readHuetten()
          .subscribe(huetten => this.huetten=huetten['records']
          );
  }


  // when user clicks the 'read' button
  readOneHuette(_id){
      // tell the parent component (AppComponent)
      this.show_read_one_huette_event.emit({
          huetteID: _id,
          title: "Read One Huette"
      });
  }

  // redirect to booking component
  openBookingFor(_id) {
    this._router.navigate(["/booking/" + _id]);
  }

}
