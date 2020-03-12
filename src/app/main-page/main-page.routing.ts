

import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page.component';
import { MainPageResolver } from './_resolvers/main-page.resolver';

const MAIN_PAGE_ROUTING: Routes = [
    {
        path: 'main',
        component: MainPageComponent
    },
    {
        path: 'record/:minTime/:maxTime',
        component: MainPageComponent,
        resolve: { record: MainPageResolver }
    },
];

export const MainPageRouting = RouterModule.forChild(MAIN_PAGE_ROUTING);
