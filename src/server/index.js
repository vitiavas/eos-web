const express = require('express')
const cors = require('cors')
const actionWatcher = require('./demux')
const io = require('./demux/ros-topics/ros-topics')
const environment = require('./environments/environment')
const { Storage, Rfid } = require('./models');
const bodyParser = require('body-parser');
var ecc = require('eosjs-ecc');
var _ = require('lodash');
const cv = require('opencv4nodejs');
const { startAgenda } = require('./services/agenda/agenda');
const { sort, getStorageRows, findStorageHashByTXID, buildUpdateTransaction } = require('./utils/utils');
const { api } = require('./services/eosjs/eosjs.service');


let app = express();

app.use(cors())
// 
// app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));

/**
 * GET
 * @param minTime most recent frame time
 * @param maxTime lates frame time
 * @param hash_rfid hash of rfid whose frame belongs to
 * Verifies Hash on Blockchain
 * Returns list of base64 decoded and normalized depth images 
 */
app.get('/data/:minTime/:maxTime/:hash_uid', (req, res) => {
  try {
    var minTime = req.params.minTime;
    var maxTime = req.params.maxTime;
    var hash_uid = req.params.hash_uid;

  } catch (err) {
    return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
  }

  Storage.find({ stamp_secs: { $gt: minTime, $lte: maxTime }, hash_uid: hash_uid }, async function (err, data) {
    let storageRows = await getStorageRows();
    let framesArray = [];
    let error;
    if (data && !_.isEmpty(data)) {
      const sortedFrames = sort(data);
      let status;
      for (let i = 0; i < sortedFrames.length; i++) {
        const txid = sortedFrames[i].txid;
        const blockchainHash = findStorageHashByTXID(storageRows, txid);
        const hash = ecc.sha256(sortedFrames[i].img_data);
        if (blockchainHash == hash) {
          status = "SUCCESSFUL";
          console.log("HASH VERIFICATION SUCCESS");
          const rows = sortedFrames[i].height;
          const cols = sortedFrames[i].width;
          const croppedImage = new cv.Mat(Buffer.from(sortedFrames[i].img_data), rows, cols, cv.CV_32FC1);
          const normalizedImg = croppedImage.convertTo(cv.CV_32FC1, 0, 125);
          const outBase64 = cv.imencode('.jpg', normalizedImg).toString('base64'); // Perform base64 encoding
          framesArray.push(outBase64);
        } else {
          status = "FAILED";
          console.log("HASH VERIFICATION FAILED");
          error = { code: 'hash.failure', message: 'blockchain.error.hash-verification' };
        }
      }

      const transaction = buildUpdateTransaction(minTime, maxTime, hash_uid, status);
      api.transact(transaction, { blocksBehind: 3, expireSeconds: 60 }).then((response) => {
          const transaction_id = response.transaction_id;
          console.log("OK");
      }).catch(error => {
          console.log(error);
      });
  
    } else {
      return res.status(400).json({ message: "Not Found" });
    }

    res.json({
      frames: framesArray,
      minTime: minTime,
      maxTime: maxTime,
      error: error 
    });
    res.end();
  });
});




const server = app.listen(environment.port, () => console.info(`Example app listening on port ${environment.port}!`))

startAgenda();

io.connect(server);

actionWatcher.watch();

