const mongoose = require('mongoose');

const { Schema } = mongoose;

let Rfid = null

try {
  const RfidSchema = new Schema({
    hash_rfid: String,
    stamp_secs: Number,
    stamp_nsecs: Number,
  })
  Rfid = mongoose.model('Rfid', RfidSchema)
} catch (e) {
    Rfid = mongoose.model('Rfid')
}

module.exports = Rfid
