/* ObjectActionHandler
 * This is an example of an AbstractActionHandler implementation.
 *
 * The role of the Action Handler is to receive block data passed from the Action Reader, and populate some external
 * state deterministically derived from that data, as well as trigger side-effects.
 *
 * The AbstractActionHandler has the following abstract methods:
 *
 * handleWithState(handle)
 *   Call the passed-in `handle` function with the object you would like to pass in as `state` to Updaters and Effects.
 *   In this example, we're just using a simple structured Javascript object, but in a real implementation this will
 *   most likely an interface to a database. See the API documentation for more details.
 *
 * updateIndexState(state, block)
 *   Besides some caching optimizations, the state of the progress of indexing is stored outside of Demux itself, and
 *   this method is implemented to store that data. The data needed to be stored is blockNumber, blockHash, isReplay,
 *   and handlerVersionName. the `state` object passed into the `handle` function of the above `handleWithState` is
 *   provided here as a convenience.
 *
 * loadIndexState()
 *   This returns an `IndexState` object containing all the information saved in the above method.
 *
 * rollbackTo(blockNumber)
 *   If indexing potentially reversible blocks, a mechanism for reverting back to a specific block is necessary.
 *   In this example, we keep a history of the entire state at every block, and load it when called.
 */

const { AbstractActionHandler } = require("demux");
const mongoose = require("mongoose");
const environment = require("../environments/environment");
// Initial state
let state = {
  volumeBySymbol: {},
  totalTransfers: 0,
  indexState: {
    blockNumber: 0,
    blockHash: "",
    isReplay: false,
    handlerVersionName: "v1",
  },
}

const stateHistory = {}
const stateHistoryMaxLength = 300

class ObjectActionHandler extends AbstractActionHandler {

  constructor(handlerVersions) {
    super(handlerVersions);

    mongoose.connect(environment.mongo_db_url, { useUnifiedTopology: true, useNewUrlParser: true })

    // CONNECTION EVENTS
    // Connection successful
    mongoose.connection.on('connected', () => {
      console.info(`Mongoose default connection open to ${environment.mongo_db_url}`)
    })

    // Connection throws an error
    mongoose.connection.on('error', console.error.bind(console, 'Mongoose default connection error:'))

    // Connection is disconnected
    mongoose.connection.on('disconnected', () => {
      console.info('Mongoose default connection disconnected')
    })

    // Close the connection if the node process is terminated
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.info('Mongoose default connection disconnected through app termination')
        process.exit(0)
      })
    })

  }

  async handleWithState(handle) {
    await handle(state)
    const { blockNumber } = state.indexState
    // const state = { storage: Storage, blockIndexState: BlockIndexState }
    stateHistory[blockNumber] = JSON.parse(JSON.stringify(state))
    if (blockNumber > stateHistoryMaxLength && stateHistory[blockNumber - stateHistoryMaxLength]) {
      delete stateHistory[blockNumber - stateHistoryMaxLength]
    }
  }

  async loadIndexState() {
    return state.indexState
  }

  async updateIndexState(stateObj, block, isReplay, handlerVersionName) {
    stateObj.indexState.blockNumber = block.blockInfo.blockNumber
    stateObj.indexState.blockHash = block.blockInfo.blockHash
    stateObj.indexState.isReplay = isReplay
    stateObj.indexState.handlerVersionName = handlerVersionName
  }

  async rollbackTo(blockNumber) {
    const latestBlockNumber = state.indexState.blockNumber
    const toDelete = [...Array(latestBlockNumber - (blockNumber)).keys()].map(n => n + blockNumber + 1)
    for (const n of toDelete) {
      delete stateHistory[n]
    }
    state = stateHistory[blockNumber]
  }

  async setup() {
  }
}

module.exports = ObjectActionHandler