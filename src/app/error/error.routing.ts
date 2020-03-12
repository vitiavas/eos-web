import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './404/404.component';
import { ErrorComponent } from './error.component';

const ERROR_ROUTING = [  
  { path: '', component: ErrorComponent },
  { path: '404', component:NotFoundComponent, data: { title:'Página não encontrada', isError:true } },
];


export const ErrorRouting = RouterModule.forChild(ERROR_ROUTING);


