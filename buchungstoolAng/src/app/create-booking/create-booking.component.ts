import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BookingService } from '../booking.service';
import { Buchung } from '../buchung';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent implements OnInit {

   	// our angular form
    create_booking_form: FormGroup;
 
    // initialize 'product service', 'category service' and 'form builder'
    constructor(
        private _bookingService: BookingService,
        formBuilder: FormBuilder,
        private _route: ActivatedRoute
    ){
        // based on our html form, build our angular form
        this.create_booking_form = formBuilder.group({
            erwachsene: ["", Validators.required],
            kinder: ["", Validators.required],
            checkinDatum: ["", Validators.required],
            checkoutDatum: ["", Validators.required]
        });
    }
 
    // user clicks 'create' button
    createBooking(){
         
        // get huetteID where the booking corresponds to ... '+' operator converts string to a number
        const id = +this._route.snapshot.paramMap.get('id');

        // send data to server
        this._bookingService.createBooking(this.create_booking_form.value)
            .subscribe(
                 booking => {
                    // show an alert to tell the user if booking was created or not
                    console.log(booking);
 
                    // go back to list of bookings
                    //this.readBookings();
                 },
                 error => console.log(error)
             );
    }
 
    ngOnInit(){
       
    }
}