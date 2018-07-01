import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HuettenComponent } from './huetten/huetten.component';
import { HuetteDetailComponent } from './huette-detail/huette-detail.component';

import { FormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';
import { HttpClientModule} from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminModule} from './admin/admin.module';
import { ReadHuettenComponent } from './dashboard/read-huetten/read-huetten.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HuettenComponent,
    HuetteDetailComponent,
    PageNotFoundComponent,
    ReadHuettenComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AdminModule,
    AppRoutingModule  // <-- needs to be last entry in imports!
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
