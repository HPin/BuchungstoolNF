import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HuettenComponent } from './huetten/huetten.component';
import { HuetteDetailComponent } from './huette-detail/huette-detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';
import { HttpClientModule} from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminModule} from './admin/admin.module';
import { ReadHuettenComponent } from './dashboard/read-huetten/read-huetten.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthService } from './auth.service';
import { CreateBookingComponent } from './create-booking/create-booking.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HuettenComponent,
    HuetteDetailComponent,
    PageNotFoundComponent,
    ReadHuettenComponent,
    LoginComponent,
    SignUpComponent,
    CreateBookingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AdminModule,
    AppRoutingModule  // <-- needs to be last entry in imports!
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
