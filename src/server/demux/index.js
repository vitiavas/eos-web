const { ExpressActionWatcher } = require('demux');
const { NodeosActionReader } = require('demux-eos');
const ObjectActionHandler = require("./ObjectActionHandler.js")
const handlerVersion = require("./handlerVersions/v1")
const environment = require("../environments/environment")

const actionHandler = new ObjectActionHandler([handlerVersion]);

const actionReader = new NodeosActionReader({
    nodeosEndpoint: environment.nodeos_url,
    onlyIrreversible: false,
    startAtBlock: 0
})
const actionWatcher = new ExpressActionWatcher(
    actionReader,
    actionHandler,
    250,
    environment.port
  )

module.exports = actionWatcher;

