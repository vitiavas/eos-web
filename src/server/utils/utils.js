

const _ = require('lodash');
const { rpc } = require('../services/eosjs/eosjs.service');
const environment = require('../environments/environment');
const ecc = require('eosjs-ecc');
const { Storage } = require('../models/index');
const { Rfid } = require('../models/index');
const uuidV4 = require('uuid/v4');
// -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1' 
/**
 * 
 * @param {*} items
 * Returns sorted list by 'seq' property 
 */
function sort(items) {
    if (items) {
        items.sort(function (a, b) {
            if (a.seq < b.seq) {
                return -1;
            }
            if (a.seq > b.seq) {
                return 1;
            }
            return 0;
        });
    }
    return items;
}
/**
 * Return all Storage Smart Contract Multi index table rows
 */
function getStorageRows() {
    return rpc.get_table_rows({
        "json": true,
        "code": 'storage',    // contract who owns the table
        "scope": 'storage',   // scope of the table
        "table": "records",    // name of the table as specified by the contract abi
        "limit": 9999
    }).catch(error => {
        return error;
    })
}
/**
 * Return all Login Smart Contract Multi index table rows 
 */
function getLoginRows() {
    return rpc.get_table_rows({
        "json": true,
        "code": 'login',    // contract who owns the table
        "scope": 'login',   // scope of the table
        "table": "users",    // name of the table as specified by the contract abi
    }).catch(error => {
        return error;
    })
}
/**
 * 
 * @param {*} storage 
 * @param {*} txid
 * returns hash stored on blockchain 
 */
function findStorageHashByTXID(storage, txid) {
    if (!_.isNil(storage) && !_.isEmpty(storage.rows)) {
        for (let i = 0; i < storage.rows.length; i++) {
            if (storage.rows[i].txid == txid) {
                return storage.rows[i].hash;
            }
        }
    }
    return null;
}

/**
 * 
 * @param {*} login 
 * @param {*} hash_rfid
 * returns username stored on blockchain 
 */
function findUserByHashRfid(login, hash_rfid) {
    if (!_.isNil(login) && !_.isEmpty(login.rows)) {
        for (let i = 0; i < login.rows.length; i++) {
            if (login.rows[i].uid == hash_rfid) {
                return login.rows[i].username;
            }
        }
    }
    return null;
}
/**
 * 
 * @param {*} msg
 * @param {*} hash_rfid
 * returns transaction ready to be pushed on blockchain 
 */
function buildTransaction(msg, hash_rfid) {
    const hash = ecc.sha256(msg.data);
    const hash_uid = hash_rfid;
    const stamp_secs = msg.header && msg.header.stamp && msg.header.stamp.secs;
    const stamp_nsecs = msg.header && msg.header.stamp && msg.header.stamp.nsecs;
    const code = uuidV4();
    return {
        actions: [{
            account: environment.eosio_contract_account_storage,
            name: environment.eosio_contract_account_storage_action_insert,
            authorization: [{
                actor: environment.eosio_account_name_producer,
                permission: environment.eosio_permission_active,
            }],
            data: {
                user: environment.eosio_account_name_producer, 
                hash: hash, 
                hash_uid: hash_uid, 
                stamp_secs: stamp_secs, 
                stamp_nsecs: stamp_nsecs,
                code: code,
                date: stamp_secs * 1000,
                event: 'CREATED',
                status: 'VERIFIED'
            },
        }],
    };
}

function buildUpdateTransaction(minTime, maxTime, hash_uid, status) {
    return {
        actions: [{
            account: environment.eosio_contract_account_storage,
            name: environment.eosio_contract_account_storage_action_update,
            authorization: [{
                actor: environment.eosio_account_name_producer,
                permission: environment.eosio_permission_active,
            }],
            data: {
                user: environment.eosio_account_name_producer, 
                event: 'ACCESSED', 
                status,
                hash_uid,
                minTime,
                maxTime,
                date: new Date().getTime().toString()
            },
        }],
    };   
}
/**
 * 
 * @param {*} msg 
 * @param {*} transaction_id 
 * Return true if data is saved
 */
function saveToDatabaseStorage(msg, transaction_id, hash_rfid) {
    const stamp_secs = msg.header && msg.header.stamp && msg.header.stamp.secs;
    const stamp_nsecs = msg.header && msg.header.stamp && msg.header.stamp.nsecs;
    let storage = new Storage;
    storage.txid = transaction_id;
    storage.hash_uid = hash_rfid;
    storage.stamp_secs = stamp_secs;
    storage.stamp_nsecs = stamp_nsecs;
    storage.seq = msg.header && msg.header.seq;
    storage.height = msg.height;
    storage.width = msg.width;
    storage.img_data = msg.data;
    if (msg.encoding == 'bayer_grbg8') {
        storage.img_content_type = "bayer_grbg8";
    } else {
        storage.img_content_type = "depth_image";
    }
    storage.step = msg.step;
    // console.log("----------------- Data to store to Database ---------------------")
    // console.log("Sequence: " + storage.seq + " - " + convertSecondsToTime(storage.stamp_secs));
    // console.log("Hash UID: " + storage.hash_uid + " | " + "Transaction ID: " + storage.txid);
    // console.log("-----------------------------------------------------------------")
    storage.save();
}

/**
 * @param given_seconds 
 * Returns time string in human readable format
 */
function convertSecondsToTime(given_seconds) {
    const dateObj = new Date(given_seconds);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getSeconds();
    const milisecods = dateObj.getMilliseconds();

    const timeString = hours.toString().padStart(2, '0') + ':' +
        minutes.toString().padStart(2, '0') + ':' +
        seconds.toString().padStart(2, '0') + ':' +
        milisecods.toString().padStart(2, '0');
    return timeString;
}

/**
 * @param given_seconds 
 * Returns time string in human readable format
 */
function convertSecondsAndNanoSecToTime(given_seconds, nanoSeconds) {
    const dateObj = new Date(given_seconds * 1000 + nanoSeconds / 1000000);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getSeconds();
    const milisecods = dateObj.getMilliseconds();

    const timeString = hours.toString().padStart(2, '0') + ':' +
        minutes.toString().padStart(2, '0') + ':' +
        seconds.toString().padStart(2, '0') + ':' +
        milisecods.toString().padStart(2, '0');
    return timeString;
}


/**
 * 
 * @param {*} msg 
 * @param {*} rfid
 * Return true if data is saved
 */
function saveToDatabaseRfid(msg, hash_rfid) {
    let rfid = new Rfid;
    rfid.hash_rfid = hash_rfid;
    // new Date().getTime()
    // convertSecondsToTime(msg.header.stamp.secs)
    // console.log(convertSecondsToTime(msg.header.stamp.secs) + " RFID discovered: { rfid: " + plain_rfid + ", hash_rfid: " + rfid.hash_rfid + " }");
    rfid.stamp_secs = msg.header && msg.header.stamp && msg.header.stamp.secs;
    rfid.stamp_nsecs = msg.header && msg.header.stamp && msg.header.stamp.nsecs;
    rfid.save();
}


module.exports = {
    sort,
    getStorageRows,
    getLoginRows,
    findStorageHashByTXID,
    buildTransaction,
    buildUpdateTransaction,
    saveToDatabaseStorage,
    saveToDatabaseRfid,
    findUserByHashRfid,
    convertSecondsToTime,
    convertSecondsAndNanoSecToTime
};