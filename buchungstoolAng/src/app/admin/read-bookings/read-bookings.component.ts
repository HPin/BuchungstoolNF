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
    rooms = ['Zimmer 1', 'Zimmer 2', 'Zimmer 3'];
    today: Date;
    year: number;
    month: number;
    numberOfDays: number;
    days: number[];
    bookingsOfMonth: Buchung[];
 
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

        this.loadCalendar();
    }

    loadCalendar() {
        let today = new Date();
        this.today = today;
        this.year = today.getFullYear();
        this.month = today.getMonth() + 1;
        this.calcDaysOfMonth();
        this.loadBookingsOfMonth();
    }

    loadBookingsOfMonth() {
        this.bookingService.readBookingsByDate(this.month, this.year)
            .subscribe(bookings =>
                this.bookingsOfMonth=bookings['records']
            );
    }

    calcDaysOfMonth() {
        this.numberOfDays = new Date(this.year, this.month, 0).getDate();

        let dayArr = Array(this.numberOfDays+1).fill(0).map((x,i)=>i);
        this.days = dayArr.slice(1);
    }

    loadNextMonth() {
        if (this.month == 12) {
            this.year += 1;
            this.month = 1;
        } else {
            this.month += 1;
        }
        this.calcDaysOfMonth();
        this.loadBookingsOfMonth();
    }

    loadPreviousMonth() {
        if (this.month == 1) {
            this.year -= 1;
            this.month = 12;
        } else {
            this.month -= 1;
        }
        this.calcDaysOfMonth();
        this.loadBookingsOfMonth();
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
