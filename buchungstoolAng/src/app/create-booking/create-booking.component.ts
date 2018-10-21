import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BookingService } from '../booking.service';
import { UserService } from '../user.service';
import { Buchung } from '../buchung';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { Huette } from '../huette';
import { HuetteService }  from '../huette.service';
import { Zimmer } from '../zimmer';
import { Zimmerkategorie }  from '../zimmerkategorie';

const monthNames = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
                        'August', 'September', 'Oktober', 'November', 'Dezember'];

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent implements OnInit {

    today: Date;
    year: number;
    month: number;
    monthName: string;
    numberOfDays: number;
    days: number[];

    bookingsOfMonth: Buchung[];
    bookingsForRoom: Buchung[];
    roomCategories: Zimmerkategorie[];
    selectedCategory: Zimmerkategorie;
    zimmerForCategoryArr: Zimmer[];
    fellowTravelerDict = {};

    paymentMethods = ["PayPal", "Sofortüberweisung", "Kreditkarte", "Zahlung auf Rechnung"];
    selectedPaymentMethod: string;

    huette: Huette;
    currentTab = 0; // Current tab is set to be the first tab (0)
    create_booking_form: FormGroup;

    // get huetteID where the booking corresponds to ... '+' operator converts string to a number
    huetteUrlID = +this.route.snapshot.paramMap.get('id');

    adultSliderValue = 1;
    teenagerSliderValue = 0;
    kidSliderValue = 0;

    dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    selectFirstDay = true;
    checkInDate = null;
    checkOutDate = null;
 
    // initialize 'product service', 'category service' and 'form builder'
    constructor(
        private bookingService: BookingService,
        private huetteService: HuetteService,
        private userService: UserService,
        formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ){
        // based on our html form, build our angular form
        this.create_booking_form = formBuilder.group({
            huetteID: this.huetteUrlID,
            erwachseneAnzahl: this.adultSliderValue,
            jugendlicheAnzahl: this.teenagerSliderValue,
            kinderAnzahl: this.kidSliderValue,
            zimmerkategorie: ["", Validators.required],
            buchenderVorname: ["", Validators.required],
            buchenderNachname: ["", Validators.required],
            buchenderGeburtsdatum: ["", Validators.required],
            buchenderAdresse: ["", Validators.required],
            buchenderPLZ: ["", Validators.required],
            buchenderOrt: ["", Validators.required],
            buchenderTelefonnummer: ["", Validators.required],
            buchenderMail: ["", Validators.required],
            zahlungsart: ["", Validators.required]
        });

        /*
        this.create_booking_form = formBuilder.group({
            huetteID: this.huetteUrlID,
            personenAnzahl: this.personSliderValue,
            zimmerkategorie: ["", Validators.required],
            erwachsene: ["", Validators.required],
            kinder: ["", Validators.required],
            checkinDatum: ["", Validators.required],
            checkoutDatum: ["", Validators.required],
            zahlungsartID: 1
        });
        */
    }

    getCartItems() {
        let arr = ["abc"];
        return  arr;
    }
 
    ngOnInit(){
       this.getHuette();
       this.getRoomCategories();
       this.showTab(this.currentTab); // Display the current tab

       this.loadCalendar();
    }

    // ---------------------- SLIDER -----------------------------------------------------
    adultSliderOnChange(_value: number) {
        this.adultSliderValue = _value; 
    }

    teenagerSliderOnChange(_value: number) {
        this.teenagerSliderValue = _value; 
    }

    kidSliderOnChange(_value: number) {
        this.kidSliderValue = _value; 
    }

    getArrayOfPersonNumber() {
        if (this.adultSliderValue <= 1) {
            return
        } else {
            var totalPersons = this.adultSliderValue + this.teenagerSliderValue + this.kidSliderValue;

            // fill array ascending starting at 1 ... 1,2,3,4,5,...n (person 0 is the booking person)
            var arr = [];
            for (var i = 1; i <= totalPersons; i++) {
                 arr.push(i);
            }
            return arr;
        }
    }

    // ---------------------- SELECT -----------------------------------------------------
    zimmerkategorieSelectOnChange(_value: string) {
        console.log("select: "+_value)

        // safety check
        if (this.roomCategories === null || typeof(this.roomCategories) === 'undefined') {
            return false;
        }

        // get category name and find corresponding ID
        let categoryName = this.create_booking_form.get('zimmerkategorie').value;
        var categoryID = -1;
        for (var i = 0; i < this.roomCategories.length; i++) {
            // safety check
            if (this.roomCategories[i] === null || typeof(this.roomCategories[i]) === 'undefined') {
                return false;
            }
            // search for the corresponding category
            if (this.roomCategories[i].name === categoryName) {
                categoryID = this.roomCategories[i].zimmerkategorieID;
            }
        }
        // return false if no matching category has been found
        if (categoryID === -1) {
            return false
        }

        // get huetteID where the booking corresponds to ... '+' operator converts string to a number
        const huetteUrlID = +this.route.snapshot.paramMap.get('id');
        this.huetteService.readZimmerWithCategory(huetteUrlID, categoryID)
               .subscribe(zimmer => this.zimmerForCategoryArr=zimmer['records']);
    }


    // ----------------------- CALENDAR --------------------------------------------------
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

    /*
     * Checks if the currently displayed day is in between the period of a booking.
     * Used to display which days are occupied and which days are not.
     */
    isOneRoomFreeOnThisDay(_day: number) {
        let freeRoomsArr: Zimmer[] = new Array();

        if (this.bookingsOfMonth === null || typeof(this.bookingsOfMonth) === 'undefined') {
            return true;
        }
        if (this.zimmerForCategoryArr === null || typeof(this.zimmerForCategoryArr) === 'undefined') {
            return false;
        }

        // filter all bookings of the month which are in the relevant time period
        let bookingsOnThisDayArr: Buchung[] = new Array();
        for(let booking of this.bookingsOfMonth) {
            let checkIn: number = new Date(booking.checkinDatum).getDate();
            let checkOut: number = new Date(booking.checkoutDatum).getDate();

            if (_day >= checkIn && _day <= checkOut) {
                bookingsOnThisDayArr.push(booking);
            }
        }

        // if there are no bookings on this day, set all rooms as 'free'
        if (bookingsOnThisDayArr.length === 0) {
            for (let zimmer of this.zimmerForCategoryArr) {
                freeRoomsArr.push(zimmer);
            }
        } else {
            // check if the filtered bookings booked a room of the selected category
            // find out which room is occupied and which is still free
            // checks for every room if there is any booking on it
            var i = 0;
            for (let zimmer of this.zimmerForCategoryArr) {
                var isRoomFree = true;
                for (let booking of bookingsOnThisDayArr) {
                    if (booking.zimmerID === zimmer.zimmerID) {
                        isRoomFree = false;
                    }
                }

                if (isRoomFree) {
                    freeRoomsArr.push(zimmer);
                }
            }
        }
        
        // return if this day is still available or not
        if (freeRoomsArr.length > 0) {
            return true;
        } else {
            return false;
        }
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

        this.monthName = monthNames[this.month - 1];

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

        this.monthName = monthNames[this.month - 1];

        this.calcDaysOfMonth();
        this.loadBookingsOfMonth();
    }


    calcFirstDayAndPaddingOfMonth() {
        // values from 0 (sunday) to 6 (saturday) ... monday -> 1
        var firstWeekday = new Date(this.year + "-" + this.month + "-01").getDay();
        firstWeekday = (firstWeekday===0) ? 7 : firstWeekday;

        // create an empty array with as many elements as there are "free" days at the beginning of the calendar view
        let emptyDaysArr: number[] = new Array();

        // start at index 1 because we want to find out the days till monday
        for(var i = 1; i<firstWeekday; i++) {
            emptyDaysArr.push(1);
        }

        return emptyDaysArr;
    }

    setCheckInDate(_day: number) {
        this.checkInDate = new Date(this.year, this.month-1, _day);
        this.selectFirstDay = false;     // check that the next click selects the checkout date
        this.checkOutDate = null;        // reset checkout in case the user selects a new date after first selection
    }

    setCheckOutDate(_day: number) {
        // check if checkout date is valid (not same day as checkin, later than checkin)
        if (this.checkInDate.getDate() === _day || _day < this.checkInDate.getDate()) {
            return
        }

        // make sure there are no bookings (i.e. unavailable days) within the selected period
        for (var i = this.checkInDate.getDate(); i <= _day; i++) {
            if (this.isOneRoomFreeOnThisDay(i) === false) {
                return
            }
        }
        // month value is one too high
        this.checkOutDate = new Date(this.year, this.month-1, _day);
        this.selectFirstDay = true;
    }

    /*
     * Checks if the current day is between the check in and check out dates
     */
    isDayInRange(_day: number) {
        if (this.checkInDate !== null && this.checkOutDate === null) {
            if (_day == this.checkInDate.getDate()) {
                return true;
            } else {
                return false;
            }
        }

        if (this.checkInDate === null && this.checkOutDate !== null) {
            if (_day == this.checkOutDate.getDate()) {
                return true;
            } else {
                return false;
            }
        }

        if (this.checkInDate === null && this.checkOutDate === null) {
            return false;
        }

        if (_day >= this.checkInDate.getDate() && _day <= this.checkOutDate.getDate()) {
            return true;
        }

    }


    // ----------------------- HUETTE --------------------------------------------------
    getHuette(): void {
        // get huetteID where the booking corresponds to ... '+' operator converts string to a number
        const huetteUrlID = +this.route.snapshot.paramMap.get('id');
        this.huetteService.readOneHuette(huetteUrlID)
            .subscribe(huette => this.huette=huette);
    }

    // ----------------------- Zimmerkategorien --------------------------------------------------
    getRoomCategories(): void {
        // get huetteID where the booking corresponds to ... '+' operator converts string to a number
        const huetteUrlID = +this.route.snapshot.paramMap.get('id');
        this.huetteService.readCategories(huetteUrlID)
            .subscribe(categories => this.roomCategories=categories['records']);
    }

    // ----------------------- BOOKING --------------------------------------------------
    // user clicks 'create' button
    createBooking(){
        console.log(this.create_booking_form)
        //this.userService.storeBooking(this.create_booking_form);
        //this.router.navigate(['/newuser']);
        /*
        // send data to server
        this.bookingService.createBooking(this.create_booking_form.value)
            .subscribe(
                 booking => {
                    // show an alert to tell the user if booking was created or not
                    console.log(booking)
                    this.router.navigate(['/newuser']);

                    // go back to list of bookings
                    //this.readBookings();
                 },
                 error => console.log(error)
             );
        */
    }

    // ----------------------- PAGE DESIGN and FORMS --------------------------------------------------
    // displays the specified tab
    showTab(_n) {
      var tabArray = document.getElementsByClassName("tab");
      var elem = <HTMLElement> tabArray[_n];
      elem.style.display = "block";    // enable display settings

      // adjust the Previous/Next buttons:
      if (_n == 0) {
        document.getElementById("prevBtn").style.display = "none";
      } else {
        document.getElementById("prevBtn").style.display = "inline";
      }

      // change button text for last index
      if (_n == (tabArray.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Jetzt Bezahlen";
      } else {
        document.getElementById("nextBtn").innerHTML = "Weiter";
      }

      // run a function that displays the correct step indicator:
      this.fixStepIndicator(_n)
    }

    // sets the "active" class to the step which is currently in view
    // used to highlight the current step indicator
    fixStepIndicator(_n) {
      // remove the "active" class of all steps...
      var stepArr = document.getElementsByClassName("step");
      for (var i = 0; i < stepArr.length; i++) {
        stepArr[i].className = stepArr[i].className.replace(" active", "");
      }

      // add the "active" class to the current step:
      stepArr[_n].className += " active";
    }

    // finds out the tab to display
    nextPrev(_n) {
      // This function will figure out which tab to display
      var tabArray = document.getElementsByClassName("tab");

      // add other behavior to button when it is the last page (payment), _n !== -1: exclude back button
      if (_n !== -1 && this.currentTab == (tabArray.length - 1)) {
          // TODO: open payment provider page
          

          switch (this.selectedPaymentMethod) {
              case "PayPal":
                  // code...
                  break;
              case "Sofortüberweisung":
                  // code...
                  break;
              case "Kreditkarte":
                  // code...
                  break;
              case "Zahlung auf Rechnung":
                  this.router.navigate(["/dashboard/"]);
                  break;

              default:
                  this.router.navigate(["/dashboard/"]);
                  break;
          }

      } else {

          var elem = <HTMLElement> tabArray[this.currentTab];

          var nextButton = document.getElementById("nextBtn")

          // Exit the function if any field in the current tab is invalid:
          if (_n == 1 && !this.validateForm()) {
              nextButton.className = "nextBtnInactive"
              return false;
          } else {
              nextButton.className = "nextBtnActive"
          }

          // Hide the current tab:
          elem.style.display = "none";

          // Increase or decrease the current tab by 1:
          this.currentTab = this.currentTab + _n;

          // if you have reached the end of the form... :
          if (this.currentTab >= tabArray.length) {
            //...the form gets submitted:
            //document.getElementById("regForm").submit();
            return false;
          }
          // Otherwise, display the correct tab:
          this.showTab(this.currentTab);
      }
    }

    // checks if form is valid
    validateForm() {
      var isFormValid = true;

      var tabArray = document.getElementsByClassName("tab");
      var elem = <HTMLElement> tabArray[this.currentTab];

      switch (this.currentTab) {
          case 0:    // tab 1
                if (this.create_booking_form.get('zimmerkategorie').value === '') {
                    isFormValid = false;
                }
                if (this.checkInDate === null || this.checkOutDate === null) {
                    isFormValid = false
                }
                break;
          case 1:
                var inputFields = elem.getElementsByTagName("input");
                for (var i = 0; i < inputFields.length; i++) {    // check every inputfield in the current tab
                    if (inputFields[i].value === "") {             // if field empty
                      inputFields[i].className += " invalid";     // add an "invalid" class to the field
                      isFormValid = false;                        // and set the current valid status to false
                    }
                }

                let age = this.calculateAge(this.create_booking_form.get('buchenderGeburtsdatum').value);
                if (age < 18 || age > 120) {
                    inputFields[2].className += " invalid";
                    isFormValid = false;
                }

                break;
          case 2:
                var inputFields = elem.getElementsByTagName("input");
                for (var i = 0; i < inputFields.length; i++) {    // check every inputfield in the current tab
                    if (inputFields[i].value === "") {             // if field empty
                      inputFields[i].className += " invalid";     // add an "invalid" class to the field
                      isFormValid = false;                        // and set the current valid status to false
                    }

                    if (i % 2 === 1) {    // every third entry is the birthdate
                        let age = this.calculateAge(inputFields[i].value);
                        if (age < 18 || age > 120) {
                            inputFields[2].className += " invalid";
                            isFormValid = false;
                        }
                    }

                }


                break;
          default:
              isFormValid = false;
              break;
      }


      
      
      // If the valid status is true, mark the step as finished and valid:
      if (isFormValid) {
        var stepArr = document.getElementsByClassName("step");
        var step = <HTMLElement> stepArr[this.currentTab];
        step.className += " finish";
      }

      isFormValid = true;
      return isFormValid; // return the valid status
    }


    private calculateAge(_birthdayString: string) {
        var birthDate = new Date(_birthdayString);
        var today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // ---------------------- ZAHLUNGSART -----------------------------------------------------
    zahlungsartSelectOnChange(_value: string) {
        console.log("select: "+_value)

        // safety check
        if (this.paymentMethods === null || typeof(this.paymentMethods) === 'undefined') {
            return false;
        }

        // get category name and find corresponding ID
        this.selectedPaymentMethod = this.create_booking_form.get('zahlungsart').value;
    }
}