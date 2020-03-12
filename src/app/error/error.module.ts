import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../core/translation';
import { NotFoundComponent } from './404/404.component';
import { ErrorComponent } from './error.component';
import { ErrorRouting } from './error.routing';

@NgModule({
  imports: [
    CommonModule,
    ErrorRouting,
    // SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [ErrorComponent, NotFoundComponent]
})
export class ErrorModule {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang("pt");
    this.translate.use("pt");
  }
 }
