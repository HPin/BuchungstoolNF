import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth-guard.service';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ReadBookingsComponent } from './read-bookings/read-bookings.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';

const adminRoutes: Routes = [
  { 
  	path: 'admin',  
  	component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [    
          { path: 'management', component: ReadBookingsComponent },      
          { path: 'bookings', component: ReadBookingsComponent },
          { path: 'booking/:id', component: BookingDetailComponent }
        ]
      }
    ]
 
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AdminRoutingModule { }
