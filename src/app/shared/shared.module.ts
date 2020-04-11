import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpLoaderFactory } from "../core/translation";
import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AlertifyModule } from "./alertify/alertify.module";
import { AlertifyService } from "../services/alertify.service";
import { HeaderComponent } from "./header/header.component";
import { BsDropdownModule } from "ngx-bootstrap";
import { InputModule } from "./components/input/input.module";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { FooterComponent } from "./footer/footer.component";
import { CardComponent } from "./components/card/card.component";
import { SearchComponent } from "./components/search/search.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { CommonModule } from "@angular/common";
import { CheckboxComponent } from "./components/checkbox/checkbox.component";

@NgModule({
  imports: [
    AlertifyModule,
    InputModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
    CheckboxComponent,
    SafeHtmlPipe,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    SearchComponent,
    SidebarComponent,
    CheckboxComponent,
    SafeHtmlPipe,
  ],
  providers: [AlertifyService],
})
export class SharedModule {}
