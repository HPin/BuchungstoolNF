import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../booking.service';
import { Observable } from 'rxjs';
import { Buchung } from '../../buchung';
import { Router } from '@angular/router';


@Component({
  selector: 'app-read-bookings',
  templateUrl: './read-bookings.component.html',
  styleUrls: ['./read-bookings.component.css'],
  providers: [BookingService]
})
export class ReadBookingsComponent implements OnInit {

  	bookings: Buchung[];
 
    constructor(
        private bookingService: BookingService,
        private _router: Router
    ){}
 

    // Read all bookings
    ngOnInit(){
        this.bookingService.readBookings()
            .subscribe(bookings =>
                this.bookings=bookings['records']
            );
    }

    // when user clicks the 'read' button
    readOneBooking(_id){
        //this._router.navigate(["/buchung/" + _id]);
    }

    createBooking() {

    }

    // when user clicks the 'update' button
    updateBooking(_id){
        
    }


    // when user clicks the 'delete' button
    deleteBooking(_id){
        // tell the parent component (AppComponent)
        
    }

}
