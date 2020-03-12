// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  blockchain: 'eos',
  nodeos_chainId: 'CHAIN_ID',
  nodeos_name: 'Local',
  nodeos_protocol: 'http',
  nodeos_port: 8888,
  nodeos_host: '127.0.0.1',
  eos_reference: "http://127.0.0.1",
  nodeos_url: "http://127.0.0.1:8888",
  express_url: "http://127.0.0.1:4000",
  eosio_contract_account_storage: "storage",
  eosio_contract_account_storage_action_insert: "insert",
  eosio_contract_account_storage_action_erase: "erase",
  eosio_contract_account_login: "login",
  eosio_contract_account_login_action_upsert: "upsert",
  eosio_contract_account_login_action_prove: "prove",
  eosio_starting_block: 1,
  port: 4000,
  mongo_db_url: "mongodb://127.0.0.1/test"
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.