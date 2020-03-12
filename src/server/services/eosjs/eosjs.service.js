const { Api } = require('eosjs/dist/eosjs-api');
const { JsonRpc } = require('eosjs/dist/eosjs-jsonrpc');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');    
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder
const environment = require('../../environments/environment');

/**
 * Eosjs Service 
 * returns rpc and api services
 * Available API endpoints listed here https://developers.eos.io/eosio-nodeos/reference
 */

this.network = {
    blockchain: environment.blockchain,
    protocol: environment.nodeos_protocol,
    host: environment.nodeos_host,
    port: environment.nodeos_port,
    name: environment.nodeos_name,
    chainId: environment.nodeos_chainId
};
const signatureProvider = new JsSignatureProvider([environment.gaspar_private_key]);
const endPoint = environment.nodeos_url;
const rpc = new JsonRpc(endPoint, { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

module.exports = {
    api,
    rpc
}