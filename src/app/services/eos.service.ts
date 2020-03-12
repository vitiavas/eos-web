import { Injectable } from '@angular/core';
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import ecc from 'eosjs-ecc';
import { Api } from 'eosjs/dist/eosjs-api';
import { JsonRpc } from 'eosjs/dist/eosjs-jsonrpc';
import { environment } from 'src/environments/environment';
declare const Buffer;
declare const buf;
// import Eos from 'eosjs'; 
@Injectable({
    providedIn: 'root'
})
export class EosService {


    api: Api;
    rpc: JsonRpc;
    scatter: any;
    network: any;
    constructor(
    ) {
        this.network = ScatterJS.Network.fromJson({
            blockchain: environment.blockchain,
            protocol: environment.nodeos_protocol,
            host: environment.nodeos_host,
            port: environment.nodeos_port,
            name: environment.nodeos_name,
            chainId: environment.nodeos_chainId
        });
        const endPoint: string = environment.nodeos_url;
        this.rpc = new JsonRpc(endPoint, { fetch });
        ScatterJS.plugins(new ScatterEOS());
        ScatterJS.scatter.connect('eos-angular').then((connected: boolean) => {
            if (!connected) {
                return false;
            }
            this.scatter = ScatterJS.scatter;
        });
    }

    connectToScatter() {
        return ScatterJS.scatter.connect('eos-angular').then((connected: boolean) => {
            if (!connected) {
                return false;
            }
            return true;
        });
    }

    getStorageRows() {
        return this.rpc.get_table_rows({
            "json": true,
            "code": 'storage',    // contract who owns the table
            "scope": 'storage',   // scope of the table
            "table": "records",    // name of the table as specified by the contract abi
            "limit": 9999
        }).catch(error => {
            return error;
        })
    }

    getLoginRows() {
        return this.rpc.get_table_rows({
            "json": true,
            "code": 'login',    // contract who owns the table
            "scope": 'login',   // scope of the table
            "table": "users",    // name of the table as specified by the contract abi
        }).catch(error => {
            return error;
        })
    }

    async removeFrames(minTime: number, maxTime: number) {
        if (!this.scatter) {
            this.scatter = await ScatterJS.scatter.connect('eos-angular').then((connected: boolean) => {
                if (!connected) {
                    return false;
                }
                return ScatterJS.scatter;
            });
        }
        const rpc: any = this.rpc;
        const eosScatter: any = this.scatter.eos(this.network, Api, { rpc });
        const account = this.scatter.identity.accounts.find(x => x.blockchain === 'eos');
        const hash_uid = localStorage.getItem('uid');
        return await eosScatter.transact({
            actions: [{
                account: environment.eosio_contract_account_storage,
                name: environment.eosio_contract_account_storage_action_erase,
                authorization: [{
                    actor: account.name,
                    permission: 'active',
                }],
                data: {
                    user: account.name, minTime: minTime, maxTime: maxTime, hash_rfid: hash_uid
                }
            }],

        }, {
            blocksBehind: 3,
            expireSeconds: 60
        });
    }

    async eraseAllDataFromStorage() {
        if (!this.scatter) {
            this.scatter = await ScatterJS.scatter.connect('eos-angular').then((connected: boolean) => {
                if (!connected) {
                    return false;
                }
                return ScatterJS.scatter;
            });
        }
        const rpc: any = this.rpc;
        const eosScatter: any = this.scatter.eos(this.network, Api, { rpc });
        const account = this.scatter.identity.accounts.find(x => x.blockchain === 'eos');
        eosScatter.transact({
            actions: [{
                account: 'storage',
                name: 'eraseall',
                authorization: [{
                    actor: account.name,
                    permission: 'active',
                }],
                data: {
                }
            }],

        }, {
            blocksBehind: 3,
            expireSeconds: 60
        });
    }




    /***
     * Verifies EOSIO signatures from unbroadcasted on-chain proofs.
     */
    async verifyEOSIOSignature() {
        if (!this.scatter) {
            this.scatter = await ScatterJS.scatter.connect('eos-angular').then((connected: boolean) => {
                if (!connected) {
                    return false;
                }
                return ScatterJS.scatter;
            });
        }
        if (!this.scatter) return false;
        if (!this.scatter.identity) return false;

        const account = this.scatter.identity.accounts.find(x => x.blockchain === 'eos');
        // We're going to catch a reference to the buffer
        const rpc: any = this.rpc;
        let buffer: any;
        const signProvider = async buf => buffer = buf;
        const eosScatter: any = this.scatter.eos(this.network, Api, { rpc });
        // NOTICE WE ARE PUTTING THE signProvider HERE!!!!!
        let transaction = {
            actions: [{
                account: environment.eosio_contract_account_login,
                name: environment.eosio_contract_account_login_action_prove,
                authorization: [{
                    actor: account.name,
                    permission: account.authority,
                }],
                data: {
                    signing: signProvider
                },
            }],
        };
        return await eosScatter.transact(transaction, { blocksBehind: 3, expireSeconds: 60, broadcast: false }).then((data: any) => {
            const signature = data.signatures[0];
            let serializedTransaction = data.serializedTransaction;
            const buffer = Buffer.concat([
                Buffer.from(environment.nodeos_chainId, 'hex'),
                serializedTransaction,
                Buffer.from(new Uint8Array(32))
            ]);
            const recovered = ecc.recover(signature, buffer);
            return recovered === account.publicKey;
        }).catch(error => {
            console.log(error);
        });
    }
}


