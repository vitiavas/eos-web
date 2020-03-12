import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';



@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', loadChildren: './layout/layout.module#LayoutModule' },
            { path: 'login', loadChildren: './login/login.module#LoginModule' },
        ],
            {
                // preloadingStrategy:PreloadAllModules,
                // Tell the router to use the HashLocationStrategy.
                useHash: true,
                // We're going to dynamically set the param-inheritance strategy based
                // on the state of the browser location. This way, the user can jump back
                // and forth between the two different modes.
                paramsInheritanceStrategy: 'always'
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
