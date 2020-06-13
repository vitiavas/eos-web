import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
} from "@angular/material";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { BsDropdownModule } from "ngx-bootstrap";
import { HttpLoaderFactory } from "../core/translation";
import { AlertifyService } from "../services/alertify.service";
import { SharedService } from "../services/shared.service";
import { AlertifyModule } from "./alertify/alertify.module";
import { CardComponent } from "./components/card/card.component";
import { InputModule } from "./components/input/input.module";
import { SearchComponent } from "./components/search/search.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";

@NgModule({
  imports: [
    AlertifyModule,
    InputModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BsDropdownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],

  declarations: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    SearchComponent,
    SidebarComponent,
    SafeHtmlPipe,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    SearchComponent,
    SidebarComponent,
    SafeHtmlPipe,
  ],
  providers: [AlertifyService, SharedService],
})
export class SharedModule {}
