import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputComponent } from "./input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FieldValidationModule } from "../field-validation/field-validation.module";

import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TimeMaskDirective } from "../../directives/time-mask.directive";
import {
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatInput,
} from "@angular/material";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FieldValidationModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [InputComponent],
  declarations: [InputComponent, TimeMaskDirective],
})
export class InputModule {}
