import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Buchung }         from '../../buchung';
import { BookingService }  from '../../booking.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css'],
  providers: [BookingService]
})
export class BookingDetailComponent implements OnInit {

  booking: Buchung;

  constructor(
  		private bookingService: BookingService,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute

  	) { }

  ngOnInit() {
  	this.getBooking();
  }

 	goBack(): void {
	    this.location.back();
	}

	getBooking(): void {
	    // get bookingID where the booking corresponds to ... '+' operator converts string to a number
	    const bookingUrlID = +this.route.snapshot.paramMap.get('id');
	    this.bookingService.readOneBooking(bookingUrlID)
	        .subscribe(booking => this.booking=booking);
	}

}
