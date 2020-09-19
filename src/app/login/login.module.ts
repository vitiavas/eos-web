import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
  TranslateLoader,
  TranslateModule,
  TranslateService
} from "@ngx-translate/core";
import { HttpLoaderFactory } from "../core/translation/translation.loader";
import { InputModule } from "../shared/components/input/input.module";
import { SharedModule } from "../shared/shared.module";
// import { effects, reducers } from '../store';
import { LoginComponent } from "./login.component";
import { LoginRouting } from "./login.routing";
import { AlertifyModule } from "../shared/alertify/alertify.module";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    LoginRouting,
    InputModule,
    AlertifyModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: []
})
export class LoginModule {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang("pt");
    this.translate.use("pt");
  }
}
