import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DescPanelComponent } from "./desc-panel/desc-panel.component";
import { CommonModule } from "@angular/common";
import { FlowModule } from "ng-flow-lib";
@NgModule({
	declarations: [AppComponent, DescPanelComponent],
	imports: [BrowserModule, CommonModule, AppRoutingModule, FlowModule, FormsModule],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents: [DescPanelComponent]
})
export class AppModule {}
