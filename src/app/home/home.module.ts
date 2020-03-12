
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../core/translation/translation.loader';
import { MainPageModule } from '../main-page/main-page.module';
import { AlertifyModule } from '../shared/alertify/alertify.module';
import { InputModule } from '../shared/components/input/input.module';
import { SharedModule } from '../shared/shared.module';
// import { effects, reducers } from '../store';
import { HomeComponent } from './home.component';
import { HomeRouting } from './home.routing';
import { RecordsListResolver } from './_resolvers/records-list.resolver';




@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRouting,
    InputModule,
    AlertifyModule,
    MainPageModule,
    // BrowserAnimationsModule,
    // PerfectScrollbarModule,
    // BsDropdownModule.forRoot(),

    // StoreModule.forFeature(STATE_ID, reducers),
    // EffectsModule.forFeature(effects),
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
    RecordsListResolver
  ]
})

export class HomeModule {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang("pt");
    this.translate.use("pt");
  }
}
