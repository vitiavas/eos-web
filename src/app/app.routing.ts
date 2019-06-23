import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginModule } from './login/login.module';

const routes: Routes = [
    { path: '', loadChildren: () => LoginModule }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    exports: [
        RouterModule
    ],
    // providers: [
    //     WINDOW_PROVIDERS,
    //     {provide: APP_BASE_HREF, useValue: '/tos'},
    // ]
})
export class AppRoutingModule { }
