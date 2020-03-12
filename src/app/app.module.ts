import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUIHttpModule } from 'ng-block-ui/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { BlockUITemplateComponent } from './block-ui.template';
import { HttpService } from './core/http/http.service';
import { AuthInterceptor } from './core/http/interceptors/api-prefix.interceptor';
import { ErrorHandlerInterceptor } from './core/http/interceptors/error-handler.interceptor';
import { HttpLoaderFactory } from './core/translation/translation.loader';
import { CustomSerializer, metaReducers, reducers } from './store';

@NgModule({
   declarations: [
      AppComponent,
      BlockUITemplateComponent
   ],
   entryComponents: [
      BlockUITemplateComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      StoreModule.forRoot(reducers, { metaReducers }),
      StoreRouterConnectingModule.forRoot(),

      EffectsModule.forRoot([]),
      TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
         }
      }),
      BlockUIModule.forRoot({
         template: BlockUITemplateComponent
      }),
      BlockUIHttpModule.forRoot({
         // exceptions - https://github.com/kuuurt13/ng-block-ui/blob/HEAD/docs/http-module.md
       })
   ],
   providers: [
      { provide: RouterStateSerializer, useClass: CustomSerializer },
      {
         provide: HttpClient,
         useClass: HttpService
      },
      ErrorHandlerInterceptor,
      AuthInterceptor
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
