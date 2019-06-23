import { Injectable } from '@angular/core';
import { Api, JsonRpc } from 'eosjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EosService {
  // public eos: any;

  // constructor() {
  //   const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
  //   const signatureProvider = new JsSignatureProvider([privateKey]);

  //   const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  //   this.eos = Eos.Localnet({
  //     httpEndpoint: environment.blockchainUrl
  //   })
    
  // }
}