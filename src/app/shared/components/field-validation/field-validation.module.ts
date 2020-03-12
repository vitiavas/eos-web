import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FieldValidationComponent } from './field-validation.component';
import { HttpLoaderFactory } from 'src/app/core/translation/translation.loader';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports:[FieldValidationComponent],
  declarations: [FieldValidationComponent]
})
export class FieldValidationModule { }
