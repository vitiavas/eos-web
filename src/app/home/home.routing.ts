

import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { MainPageComponent } from '../main-page/main-page.component';
import { MainPageResolver } from '../main-page/_resolvers/main-page.resolver';
import { RecordsListResolver } from './_resolvers/records-list.resolver';

const HOME_ROUTING: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            recordsList: RecordsListResolver
        }
    },
    {
        path: 'record/:id',
        component: MainPageComponent,
        resolve: { record: MainPageResolver }
    },
];

export const HomeRouting = RouterModule.forChild(HOME_ROUTING);
