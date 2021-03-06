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
    adultRooms: Zimmer[];

    today: Date;
    year: number;
    month: number;
    monthName: string;
    numberOfDays: number;
    days: number[];
    isFirstCalendarStart = true;

    bookingsOfMonth: Buchung[];
    bookingsForRoom: Buchung[];
    roomCategories: Zimmerkategorie[];
    selectedCategory: Zimmerkategorie;
    zimmerForCategoryArr: Zimmer[];
    selectedRoomsArr: Zimmer[];
    fellowTravelerDict = {};

    selectedBreakfasts = 0;
    
    paymentMethods = ["PayPal", "Sofortüberweisung", "Kreditkarte", "Zahlung auf Rechnung"];
    selectedPaymentMethod: string;

    huette: Huette;
    currentTab = 0; // Current tab is set to be the first tab (0)
    create_booking_form: FormGroup;

    // get huetteID where the booking corresponds to ... '+' operator converts string to a number
    huetteUrlID = +this.route.snapshot.paramMap.get('id');

    amountAdults = 1;
    amountTeenagers = 0;
    amountKids = 0;
    totalPersons = 1;

    dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    selectFirstDay = true;
    checkInDate = null;
    checkOutDate = null;
    monthOfCheckInDate: number;
    yearOfCheckInDate: number;
    areBookingsReadyForMonth = false;
 
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
            erwachseneAnzahl: this.amountAdults,
            jugendlicheAnzahl: this.amountTeenagers,
            kinderAnzahl: this.amountKids,
            zimmerkategorie: ["", Validators.required],
            breakfasts: this.selectedBreakfasts,
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
 
    ngOnInit(){
       this.getHuette();
       this.getRoomCategories();
       this.showTab(this.currentTab); // Display the current tab

       this.loadCalendar();
    }

    // ---------------------- SLIDER -----------------------------------------------------
    adultSliderOnChange(_value: number) {
        this.amountAdults = _value; 
    }

    teenagerSliderOnChange(_value: number) {
        this.amountTeenagers = _value; 
    }

    kidSliderOnChange(_value: number) {
        this.amountKids = _value; 
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

    breakfastSelectOnChange(_value: number) {
        console.log("select: "+_value)
        this.selectedBreakfasts = _value;
    }

   adultSelectOnChange(_value: number) {
        console.log("select: "+_value)
        this.amountAdults = _value;
    }

    teenagerSelectOnChange(_value: number) {
        console.log("select: "+_value)
        this.amountTeenagers = _value;
    }

    kidSelectOnChange(_value: number) {
        console.log("select: "+_value)
        this.amountKids = _value;
    }

    calcTotalPersons() {
        return Number(this.amountAdults) + Number(this.amountTeenagers) + Number(this.amountKids);
    }

    getTotalPersonsArray(_startIndex: number) {
        // create an empty array with one element for each person
        let personArr: number[] = new Array();

        if (_startIndex === 0) {
            // fill array ascending starting at 0 ... 0,1,2,3,4,5,...n (including the booking person)
            for (var i = 0; i <= this.calcTotalPersons(); i++) {
                personArr.push(i);
            }
        } else {
            // fill array ascending starting at 1 ... 1,2,3,4,5,...n (person 0 is the booking person)
            for (var i = 1; i < this.calcTotalPersons(); i++) {
                personArr.push(i);
            }
        }

        return personArr;
    }

    // ----------------------- CALENDAR --------------------------------------------------
    loadCalendar() {
        console.log("loadCalendar")
        let today = new Date();
        this.today = today;
        this.year = today.getFullYear();
        this.month = today.getMonth() + 1;
        this.monthName = monthNames[today.getMonth()];
        this.calcDaysOfMonth();
        this.loadBookingsOfMonth();
    }

    loadBookingsOfMonth() {
        console.log("loadBookingsOfMonth")

        this.bookingService.readBookingsByDate(this.month, this.year).subscribe(
                bookings => {
                    this.bookingsOfMonth=bookings['records'];
                    this.areBookingsReadyForMonth = true;
                } 
            );

        if (this.bookingsOfMonth === null || typeof(this.bookingsOfMonth) === 'undefined') {
            this.areBookingsReadyForMonth = false;
        }

    }

    /*
     * Checks if the currently displayed day is in between the period of a booking.
     * Used to display which days are occupied and which days are not.
     */
    isOneRoomFreeOnThisDay(_day: number) {
        // while (!this.areBookingsReadyForMonth) {

        // }

        if (this.isFirstCalendarStart) {
            this.loadBookingsOfMonth();
            this.isFirstCalendarStart = false;
        }

        var freeRoomsArr: Zimmer[] = new Array();
        var selectedArr: Zimmer[] = new Array();

        if (this.bookingsOfMonth === null || typeof(this.bookingsOfMonth) === 'undefined') {
            return true;
        }
        if (this.zimmerForCategoryArr === null || typeof(this.zimmerForCategoryArr) === 'undefined') {
            return false;
        }

        // filter all bookings of the month which are in the relevant time period
        let bookingsOnThisDayArr: Buchung[] = new Array();
        for (let booking of this.bookingsOfMonth) {
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

            // loop only used for debug
            // console.log("***")
            // freeRoomsArr.forEach(element => {
            //     console.log(element.bezeichnung + " hat " + element.plaetze + " frei am " + _day + "." + this.month + ".")
            // });

            // simple room distribution approach: fill up rooms sequentially with the needed beds
            var personAmount = this.calcTotalPersons();         // store amount of total persons
            var index = 0;                                      // array index
            while (personAmount > 0) {                          // test if end of persons has been reached (-> no other room necessary)
                if (freeRoomsArr[index] === null || typeof(freeRoomsArr[index]) === 'undefined') {             // safety check
                    return false;
                }

                selectedArr.push(freeRoomsArr[index]);          // select this room
                personAmount -= freeRoomsArr[index].plaetze;    // subtract beds of room from the person amount
                index++;                                                
            }
            
            this.selectedRoomsArr = selectedArr;                // store selected rooms for later use


            return true;
        } else {
            // console.log("***")
            // console.log("kein Zimmer mehr frei am "  + _day + "." + this.month + ".")
            return false;
        }
    }

    calcDaysOfMonth() {
        console.log("calcDaysOfMonth")
        this.numberOfDays = new Date(this.year, this.month, 0).getDate();

        let dayArr = Array(this.numberOfDays+1).fill(0).map((x,i)=>i);
        this.days = dayArr.slice(1);
    }

    loadNextMonth() {
        console.log("loadNextMonth")
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
        console.log("------------------")
        console.log("loadPreviousMonth")
        if (this.month == 1) {
            this.year -= 1;
            this.month = 12;
        } else {
            this.month -= 1;
        }

        this.monthName = monthNames[this.month - 1];

        this.calcDaysOfMonth();
        this.areBookingsReadyForMonth = false;
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
        this.monthOfCheckInDate = this.month;   // save month for bookings which belong to multiple months
        this.yearOfCheckInDate = this.year;     // save year for bookings which belong to multiple months/years
    }

    setCheckOutDate(_day: number) {
        // see if checkout is in the same year or if another year was selected
        if (this.year === this.yearOfCheckInDate) {

            // see if checkout is in the same month or if another month was selected
            if (this.month === this.monthOfCheckInDate) {
                console.log("use same month")
                // in same month: must not be the same day as checkin and later than checkin)
                if (this.checkInDate.getDate() === _day || _day < this.checkInDate.getDate()) {
                    return
                }
            } else if (this.month < this.monthOfCheckInDate) {    // month in same year must not be < month of check in
                return;
            }
            
        } else if (this.year < this.yearOfCheckInDate) {      // year must not be < year of check in
            return;
        }
        

        // make sure there are no bookings (i.e. unavailable days) within the selected period
        for (var i = this.checkInDate.getDate(); i <= _day; i++) {
            if (this.isOneRoomFreeOnThisDay(i) === false) {
                return
            }
        }
        // month value is one too high for this constructor
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


    calcNightsBetweenDates() {
        if (this.checkInDate === null || this.checkOutDate === null) {
            return;
        }

        //Get 1 day in milliseconds
        var one_day=1000*60*60*24;
        
        // Convert both dates to milliseconds
        var date1_ms = this.checkInDate.getTime();
        var date2_ms = this.checkOutDate.getTime();
        
        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
            
        // Convert back to days and return
        return Math.round(difference_ms/one_day); 
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

    // ----------------------- CHECKOUT --------------------------------------------------
    getSinglePriceForAdults() {
        if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
            return;
        }
        if (this.selectedRoomsArr[0] === null) {
            return;
        }
        
        var val = Number(this.selectedRoomsArr[0].preisErw);
        return this.toATLocale(val);
    }

    calcTotalPriceForAdults() {
        if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
            return;
        }
        if (this.selectedRoomsArr[0] === null) {
            return;
        }
        var val = (this.selectedRoomsArr[0].preisErw * this.calcNightsBetweenDates() * this.amountAdults);
        return this.toATLocale(val);
    }

    getSinglePriceForTeenagers() {
        if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
            return;
        }
        if (this.selectedRoomsArr[0] === null) {
            return;
        }
        var val = Number(this.selectedRoomsArr[0].preisJgd);
        return this.toATLocale(val);
    }

    calcTotalPriceForTeenagers() {
        if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
            return;
        }
        if (this.selectedRoomsArr[0] === null) {
            return;
        }
        var val = (this.selectedRoomsArr[0].preisJgd * this.calcNightsBetweenDates() * this.amountTeenagers);
        return this.toATLocale(val);
    }

    getSinglePriceForKids() {
        var val = 0;
        return this.toATLocale(val);
    }

    calcTotalPriceForKids() {
        var val = 0;
        return this.toATLocale(val);
    }

    getSinglePriceForBreakfasts() {
        if (this.huette === null || typeof(this.huette) === 'undefined') {
            return;
        }
        var val = Number(this.huette.fruehstueckspreis);
        return this.toATLocale(val);
    }

    calcTotalPriceForBreakfasts() {
        if (this.huette === null || typeof(this.huette) === 'undefined') {
            return;
        }
        var val = (this.selectedBreakfasts * this.huette.fruehstueckspreis * this.calcNightsBetweenDates());
        return this.toATLocale(val);
    }

    calcTotalSumOfServices() {
        if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
            return;
        }
        if (this.selectedRoomsArr[0] === null) {
            return;
        }

        var adult = (this.selectedRoomsArr[0].preisErw * this.calcNightsBetweenDates() * this.amountAdults);
        var teen = (this.selectedRoomsArr[0].preisJgd * this.calcNightsBetweenDates() * this.amountTeenagers);
        var kid = 0;
        var breakfast = (this.selectedBreakfasts * this.huette.fruehstueckspreis * this.calcNightsBetweenDates());

        var val =   (Number(adult) + 
                    Number(teen) + 
                    Number(kid) + 
                    Number(breakfast)
                    );

        return this.toATLocale(val);
    }

    // ----------------------- Price --------------------------------------------------
    getAdultPriceForCategory(_catID: number): number {
        var aRooms: Zimmer[];

        // get array of rooms for category
        const urlID = +this.route.snapshot.paramMap.get('id');
        this.huetteService.readZimmerWithCategory(urlID, _catID)
                .subscribe(zimmer => this.adultRooms=zimmer['records']);

        if (this.adultRooms === null || typeof(this.adultRooms) === 'undefined') {
            return -1;
        } else {
            // only use first entry as an example to get the price:
            return this.adultRooms[0].preisErw;
        }
    }

    getTeenagerPriceForCategory(_catID: number): number {
        // safety check
        if (this.roomCategories === null || typeof(this.roomCategories) === 'undefined') {
            return -1;
        }

        var tRooms: Zimmer[];

        // get array of rooms for category
        const urlID = +this.route.snapshot.paramMap.get('id');
        this.huetteService.readZimmerWithCategory(urlID, _catID)
                .subscribe(zimmer => tRooms=zimmer['records']);


        // only use first entry as an example to get the price:
        return tRooms[0].preisJgd;
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
          case 2:
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
          case 3:
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


    toATLocale(_x) {
        if (_x === null || typeof(_x) === 'undefined') {
            return;
        }

        return _x.toLocaleString('de-AT', {
            style: 'currency', 
            currency: 'EUR', 
            minimumFractionDigits: 2 
          });
    }
}