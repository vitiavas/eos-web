const mongoose = require('mongoose');

const { Schema } = mongoose;

let Storage = null

try {
  const StorageSchema = new Schema({
    id: Number, 
    txid: String,
    height: Number,
    width: Number,
    hash_uid: String,
    stamp_secs: Number,
    stamp_nsecs: Number,
    img_data: Buffer,
    img_content_type: String,
    seq: Number
  })
  Storage = mongoose.model('Storage', StorageSchema)
} catch (e) {
  Storage = mongoose.model('Storage')
}

module.exports = Storage
