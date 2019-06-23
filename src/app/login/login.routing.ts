

import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from './login.component';

const LOGIN_ROUTING: Routes = [
    { 
        path: '', 
        component: LoginComponent, 
        resolve: { 
        
        } 
    },
    { path: 'login', component: LoginComponent },
];

export const LoginRouting = RouterModule.forChild(LOGIN_ROUTING);
