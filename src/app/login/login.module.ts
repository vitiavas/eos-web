
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
// import { effects, reducers } from '../store';
import { LoginComponent } from './login.component';
import { LoginRouting } from './login.routing';



@NgModule({
  declarations: [
      LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRouting,
    // PerfectScrollbarModule,
    // BsDropdownModule.forRoot(),
 
    // StoreModule.forFeature(STATE_ID, reducers),
    // EffectsModule.forFeature(effects),
    ReactiveFormsModule,
  ],
  providers: [ ]
})

export class LoginModule {
  constructor() { }
 }
