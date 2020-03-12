
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AlertifyComponent } from './alertify.component';
import { HttpLoaderFactory } from 'src/app/core/translation/translation.loader';

@NgModule({
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [AlertifyComponent],
  exports: [AlertifyComponent]
})
export class AlertifyModule { }
