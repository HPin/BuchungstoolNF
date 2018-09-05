import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../booking.service';
import { ZimmerService } from '../../zimmer.service';
import { Observable } from 'rxjs';
import { Buchung } from '../../buchung';
import { Zimmer } from '../../zimmer';
import { Router } from '@angular/router';

const monthNames = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
                        'August', 'September', 'Oktober', 'November', 'Dezember'];

@Component({
  selector: 'app-read-bookings',
  templateUrl: './read-bookings.component.html',
  styleUrls: ['./read-bookings.component.css'],
  providers: [BookingService, ZimmerService]
})
export class ReadBookingsComponent implements OnInit {

    zimmerArr: Zimmer[];
    rooms = ['Zimmer 1', 'Zimmer 2', 'Zimmer 3'];
    today: Date;
    year: number;
    month: number;
    monthName: string;
    numberOfDays: number;
    days: number[];
    bookingsOfMonth: Buchung[];
    bookingsForRoom: Buchung[];
 
    constructor(
        private bookingService: BookingService,
        private zimmerService: ZimmerService,
        private router: Router
    ){}

    ngOnInit(){
        
        this.zimmerService.readZimmer()
            .subscribe(zimmer =>
                this.zimmerArr=zimmer['records']
             );
        
        this.loadCalendar();
    }
 
    /*
     * Checks if the currently displayed day is in between the period of a booking.
     * Used to display which days are occupied and which days are not.
     */
    isRoomOccupiedAtThisDay(_day: number, _booking: Buchung) {
        // create new date because the date is only recognized as a string
        // --> date functions would not work
        let checkIn: number = new Date(_booking.checkinDatum).getDate();
        let checkOut: number = new Date(_booking.checkoutDatum).getDate();

        if (_day >= checkIn && _day <= checkOut) {
            return true;
        } else {
            return false;
        }

    }
    
    getBookingsForRoom(_zimmerID: number) {

        let bookingArr: Buchung[] = new Array();

        if (this.bookingsOfMonth == null) {
            return
        }

        for (let booking of this.bookingsOfMonth) {
            if (booking.zimmerID === _zimmerID) {
                bookingArr.push(booking);
            }
        }

        this.bookingsForRoom = bookingArr;
        return bookingArr;
    }


    loadCalendar() {
        let today = new Date();
        this.today = today;
        this.year = today.getFullYear();
        this.month = today.getMonth() + 1;
        this.monthName = monthNames[today.getMonth()];
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
        this.router.navigate(["/admin/booking/" + _id]);
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
