import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DepotComponent } from './depot/depot.component';
import { BusComponent } from './bus/bus.component';

@NgModule({
  declarations: [
    AppComponent,
    DepotComponent,
    BusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
