import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DescPanelComponent } from './desc-panel/desc-panel.component';
import { CommonModule } from '@angular/common';
import { FlowModule } from 'ng-flow-lib';
import { WheelDescPanelComponent } from './wheel-desc-panel/wheel-desc-panel.component';
@NgModule({
	declarations: [AppComponent, DescPanelComponent, WheelDescPanelComponent],
	imports: [BrowserModule, CommonModule, AppRoutingModule, FlowModule, FormsModule],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents: [DescPanelComponent, WheelDescPanelComponent]
})
export class AppModule {}
