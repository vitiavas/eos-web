const socketIO = require('socket.io')
let io = null
const rosnodejs = require('rosnodejs');
const { api } = require('../../services/eosjs/eosjs.service');
const { Rfid } = require('../../models/index');
const { buildTransaction, saveToDatabaseStorage, saveToDatabaseRfid, getLoginRows, findUserByHashRfid, convertSecondsToTime, convertSecondsAndNanoSecToTime } = require('../../utils/utils');
const _ = require('lodash');
const ecc = require('eosjs-ecc');

/**
 * Connects to Socket and subscribes to ros nodes 
 */
const connect = (server) => {
    io = socketIO(server);
    // Register node with ROS master
    // Options: rosMasterUri
    //rosnodejs.initNode('/my_node', { rosMasterUri: 'http://10.1.15.26:11311' } )
    rosnodejs.initNode('/my_node', { rosMasterUri: 'http://localhost:11311' })
        .then((rosNode) => {
            /**
             * Store Depth images on blockchain and database
             * 1. Get all Rfids present in database (users detected during image capture)
             * 2. Encrypt depth image with user's public key
             * 3. Store Hash of depth image on blockchain
             * 4. Store depth image encrypted on database
             */
            let subscriptionDepthImages = rosNode.subscribe('/mbot09/kinect/depth/image', 'sensor_msgs/Image', async (msg) => {
                // console.log(msg.header.stamp.secs);
                // console.log(convertSecondsToTime(msg.header.stamp.secs) + " IMAGE");
                const IMAGE_RETRIEVE = "IMAGE_RETRIEVE";
                console.log(convertSecondsToTime(new Date().getTime()) + ", " + IMAGE_RETRIEVE + ", " + msg.header.seq);
                const diferenceBetweenTwoTimestamps = 1583172999 - 1583170533; // img - rfid
                const delta = 5;
                const rfidsList = await Rfid.aggregate([{ $sort: { stamp_secs: -1 } }, { $group: { _id: '$hash_rfid', rfid_seconds: { $first: '$stamp_secs' } } }]);
                if (!_.isEmpty(rfidsList)) {
                    let loginRows = await getLoginRows();
                    for (let i = 0; i < rfidsList.length; i++) {
                        let rfid = rfidsList[i];
                        // new Date().getTime();
                        // convertSecondsToTime(new Date().getTime())
                        // convertSecondsToTime(msg.header.stamp.secs)

                        const imageTime = msg.header.stamp.secs - diferenceBetweenTwoTimestamps;
                        if (imageTime >= rfid.rfid_seconds - delta &&
                            imageTime <= rfid.rfid_seconds + delta) {
                            let username = findUserByHashRfid(loginRows, rfid._id);
                            if (username) {
                                console.log(convertSecondsToTime(new Date().getTime()) + ", " + "IMAGE_PAIRED" + ", " + msg.header.seq + ", " + rfid._id);
                                // TDO Encrypt depth image with encryption key
                                // https://github.com/GetScatter/ScatterDesktop/issues/43
                                const transaction = buildTransaction(msg, rfid._id);
                                api.transact(transaction, { blocksBehind: 3, expireSeconds: 60 }).then((response) => {
                                    const transaction_id = response.transaction_id;
                                    console.log(convertSecondsToTime(new Date().getTime()) + ", " + "BLOCKCHAIN_TRANSACTION" + ", " + msg.header.seq + ", " + rfid._id + ", " + transaction_id);
                                    saveToDatabaseStorage(msg, transaction_id, rfid._id);
                                    console.log(convertSecondsToTime(new Date().getTime()) + ", " + "DATABASE_PERSISTANCE" + ", " + msg.header.seq + ", " + rfid._id + ", " + transaction_id);
                                }).catch(error => {
                                    // console.log("-----------------------Transaction Failure-----------------------------");
                                    console.log(error);
                                });
                            } else {
                                console.log(convertSecondsToTime(new Date().getTime()) + ", " + "IMAGE_NOT_PAIRED_WITH_UNKNOWN_RFID" + ", " + msg.header.seq);
                            }
                        } else {
                            if(i == 0)
                                console.log(convertSecondsToTime(new Date().getTime()) + ", " + "IMAGE_NOT_PAIRED_NOT_EXIST_RFID" + ", " + msg.header.seq);
                        }
                    }
                } else {
                    console.log(convertSecondsToTime(new Date().getTime()) + ", " + "IMAGE_NOT_PAIRED_NOT_EXIST_RFID" + ", " + msg.header.seq);
                }
            });
            // let subscriptionRgbImages = rosNode.subscribe('/mbot09/kinect/rgb/image_raw', 'sensor_msgs/Image', async (msg) => {
            //     console.log("IMAGE");
            //     console.log(msg.header.stamp.secs);
            //     console.log("Image time " + convertSecondsToTime(msg.header.stamp.secs));
            //     const diferenceBetweenTwoTimestamps = 1583172999 - 1583170533; // img - rfid
            //     const timeInterval = 10;
            //     const rfidsList = await Rfid.aggregate([{ $sort: { stamp_secs: -1 } }, { $group: { _id: '$hash_rfid', rfid_seconds: { $first: '$stamp_secs' } } }]);
            //     if (!_.isEmpty(rfidsList)) {
            //         let loginRows = await getLoginRows();
            //         for (let i = 0; i < rfidsList.length; i++) {
            //             let hash_rfid = rfidsList[i];
            //             const imageTime = msg.header.stamp.secs - diferenceBetweenTwoTimestamps;
            //             if (imageTime >= hash_rfid.rfid_seconds - 5 &&
            //                 imageTime <= hash_rfid.rfid_seconds + 5) {
            //                 console.log('image time ' + imageTime);
            //                 console.log('rfid time ' + hash_rfid.rfid_seconds);
            //                 console.log('difference ');
            //                 console.log(imageTime - hash_rfid.rfid_seconds);
            //                 let username = findUserByHashRfid(loginRows, hash_rfid._id);
            //                 if (username) {
            //                     // TODO Encrypt depth image with encryption key
            //                     // https://github.com/GetScatter/ScatterDesktop/issues/43
            //                     const transaction = buildTransaction(msg, hash_rfid._id);
            //                     api.transact(transaction, { blocksBehind: 3, expireSeconds: 60 }).then((response) => {
            //                         console.log("-----------------------Transaction Success----------------------------");
            //                         console.log("----------------------------------------------------------------------");
            //                         const transaction_id = response.transaction_id;
            //                         saveToDatabaseStorage(msg, transaction_id, hash_rfid._id);
            //                         console.log("Save to Database Success");
            //                     }).catch(error => {
            //                         console.log("-----------------------Transaction Failure-----------------------------");
            //                         console.log(error);
            //                     });
            //                 } else {
            //                     console.log("User with RFID: " + hash_rfid._id + " Not Found");
            //                 }
            //             }
            //         }
            //     } else {
            //         console.log("Rfid List is empty");
            //     }
            // });

            /**
             * Store Rfid to database
             */
            let subscriptionRfidsTag = rosNode.subscribe('/mbot09/rfid_tag', 'monarch_msgs/RfidReading', (msg) => {
                const RFID_RETRIEVE = 'RFID_RETRIEVE';
                if (msg && !_.isNil(msg.tag_id) && !_.isEmpty(msg.tag_id.words)) {
                    let list_hash_rfid = [];
                    for (let i = 0; i < msg.tag_id.length; i++) {
                        const rfid = msg.tag_id.words[i];
                        const hash_rfid = ecc.sha256('' + rfid);
                        list_hash_rfid.push(hash_rfid);
                        saveToDatabaseRfid(msg, hash_rfid);
                    }
                    console.log(convertSecondsToTime(new Date().getTime()) + ", " + RFID_RETRIEVE + ", " + msg.tag_id.words + ", " + list_hash_rfid);
                }
            });

            let subscriptionRfidsPosition = rosNode.subscribe('/mbot09/rfid_position', 'monarch_msgs/RfidReading', (msg) => {
                const RFID_RETRIEVE = 'RFID_RETRIEVE';
                if (msg && !_.isNil(msg.tag_id) && !_.isEmpty(msg.tag_id.words)) {
                    let list_hash_rfid = [];
                    for (let i = 0; i < msg.tag_id.length; i++) {
                        const rfid = msg.tag_id.words[i];
                        const hash_rfid = ecc.sha256('' + rfid);
                        list_hash_rfid.push(hash_rfid);
                        saveToDatabaseRfid(msg, hash_rfid);
                    }
                    console.log(convertSecondsToTime(new Date().getTime()) + ", " + RFID_RETRIEVE + ", " + msg.tag_id.words + ", " + list_hash_rfid);
                }
            })
        });

}

const getSocket = () => io

module.exports = {
    connect,
    getSocket
}