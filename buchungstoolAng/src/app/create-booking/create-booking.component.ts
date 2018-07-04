import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BookingService } from '../booking.service';
import { UserService } from '../user.service';
import { Buchung } from '../buchung';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent implements OnInit {

   	// our angular form
    create_booking_form: FormGroup;
    // get huetteID where the booking corresponds to ... '+' operator converts string to a number
    huetteUrlID = +this._route.snapshot.paramMap.get('id');
 
    // initialize 'product service', 'category service' and 'form builder'
    constructor(
        private _bookingService: BookingService,
        private _userService: UserService,
        formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        // based on our html form, build our angular form
        this.create_booking_form = formBuilder.group({
            huetteID: this.huetteUrlID,
            erwachsene: ["", Validators.required],
            kinder: ["", Validators.required],
            checkinDatum: ["", Validators.required],
            checkoutDatum: ["", Validators.required],
            zahlungsartID: 1
        });

        
    }
 
    // user clicks 'create' button
    createBooking(){
        this._userService.storeBooking(this.create_booking_form);
        this._router.navigate(['/newuser']);
        /*
        // send data to server
        this._bookingService.createBooking(this.create_booking_form.value)
            .subscribe(
                 booking => {
                    // show an alert to tell the user if booking was created or not
                    console.log(booking)
                    this._router.navigate(['/newuser']);

                    // go back to list of bookings
                    //this.readBookings();
                 },
                 error => console.log(error)
             );
        */
    }
 
    ngOnInit(){
       
    }
}