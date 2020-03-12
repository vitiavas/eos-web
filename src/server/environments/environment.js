// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const environment = {
    eosio_contract_account_storage: "storage",
    eosio_contract_account_storage_action_insert: "insert",
    eosio_contract_account_storage_action_erase: "erase",
    eosio_account_name_producer: "gaspar",
    eosio_permission_active: "active",
    eosio_starting_block: 1,
    port: 4000,
    mongo_db_url: "mongodb://127.0.0.1/test",
    express_url: "http://127.0.0.1:4000",
    nodeos_url: "http://127.0.0.1:8888",
    ros_url: "http://",
    dbName: "test",
    gaspar_private_key: 'ROBOT_PRIVATE_KEY',
};

module.exports = environment
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.