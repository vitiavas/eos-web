import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import ecc from 'eosjs-ecc';
@Injectable({
    providedIn: 'root'
})
export class ExpressService {

    constructor(
        private router: Router
    ) {
    }



    loadRecord(minTime: string, maxTime: string) {
        const hash_uid = localStorage.getItem('uid');
        return axios.get(`${environment.express_url}/data/${minTime}/${maxTime}/${hash_uid}`).catch((error: any) => {
            console.log(error);
            this.router.navigate(['error', '404'], { queryParams: { returnUrl: this.router.url } });
        })
    }


}
