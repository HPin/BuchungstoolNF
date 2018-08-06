import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ReadBookingsComponent } from './read-bookings/read-bookings.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ],
  declarations: [AdminComponent, SignInComponent, ReadBookingsComponent, BookingDetailComponent]
})
export class AdminModule { }
