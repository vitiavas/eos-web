import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldValidationModule } from '../field-validation/field-validation.module';


@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      FieldValidationModule
   ],
   exports: [
      InputComponent
   ],
   declarations: [
      InputComponent
   ]
})
export class InputModule { }
