import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EosService } from 'src/app/services/eos.service';

@Injectable()
export class RecordsListResolver implements Resolve<any> {

    isStored: boolean = false;

    constructor(
        private eosService: EosService
    ) {
        // https://github.com/EOSIoT/rfid-scanner-node
        // "node-rfid": "^1.0.7",

    }

    resolve(): any {
        return this.eosService.getStorageRows();
    }
}
