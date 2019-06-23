import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { InfoComponent } from './info/info.component';
import { BlockUITemplateComponent } from './block-ui.template';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [
    AppComponent,
    BlockUITemplateComponent,
    InfoComponent
  ],
  entryComponents: [
    BlockUITemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BlockUIModule.forRoot({
      template: BlockUITemplateComponent,
       delayStart: 100,
       delayStop: 100
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
