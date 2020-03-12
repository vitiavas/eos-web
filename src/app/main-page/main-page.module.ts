import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../core/translation/translation.loader';
import { AlertifyModule } from '../shared/alertify/alertify.module';
import { InputModule } from '../shared/components/input/input.module';
import { SharedModule } from '../shared/shared.module';
import { MainPageComponent } from './main-page.component';
import { MainPageRouting } from './main-page.routing';
import { MainPageResolver } from './_resolvers/main-page.resolver';
@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainPageRouting,
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
    }),
  ],
  providers: [
    MainPageResolver
  ]
})
export class MainPageModule {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang("pt");
    this.translate.use("pt");
  }
}
