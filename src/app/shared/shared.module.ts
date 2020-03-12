import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../core/translation';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AlertifyModule } from './alertify/alertify.module';
import { AlertifyService } from '../services/alertify.service';
import { HeaderComponent } from './header/header.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { InputModule } from './components/input/input.module';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FooterComponent } from './footer/footer.component';


@NgModule({
    imports: [
      AlertifyModule,
      InputModule,
      BsDropdownModule.forRoot(),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
        }),
    ],

    declarations: [
        HeaderComponent,
        FooterComponent,
        SafeHtmlPipe
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        SafeHtmlPipe
    ],
    providers: [
        AlertifyService
    ]
  })

export class SharedModule { }
