import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule, TabsModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AlertifyModule } from '../shared/alertify/alertify.module';
import { SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './layout.component';
import { LayoutRouting } from './layout.routing';


@NgModule({
  imports: [
    CommonModule,
    LayoutRouting,
    FormsModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    SharedModule,
    AlertifyModule
  ],
  declarations: [
    LayoutComponent,
  ],
  providers: [
  ],
})

export class LayoutModule { }
