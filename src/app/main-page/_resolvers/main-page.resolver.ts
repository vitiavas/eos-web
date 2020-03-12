import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ExpressService } from 'src/app/services/express.service';

@Injectable()
export class MainPageResolver implements Resolve<any> {

    isStored: boolean = false;

    constructor(
        private expressService: ExpressService
    ) {
        // https://github.com/EOSIoT/rfid-scanner-node
        // "node-rfid": "^1.0.7",

    }

    resolve(route: ActivatedRouteSnapshot): any {
        const minTime: string = route.params["minTime"];
        const maxTime: string = route.params["maxTime"];
        return this.expressService.loadRecord(minTime, maxTime);
    }
}
