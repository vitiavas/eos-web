const Agenda = require('agenda');
const environment = require('../../environments/environment');
const mongoConnectionString = environment.mongo_db_url;
const { Rfid } = require('../../models/index');


/**
 * Agenda Instance
 */
const agenda = new Agenda({ db: { address: mongoConnectionString } });

/**
 * Today Date
 */
const TimeStamp = 1570813758;
                  

/**
 * Job Definition
 * @param name
 */
agenda.define('rfid_delete', async job => {
    var today = new Date();
    var today_abs = new Date();
    today_abs.setHours(0);
    today_abs.setMinutes(0);
    today_abs.setSeconds(0);
    today_secs = today.getTime();
    // console.log(today_secs);
    console.log(today.getUTCFullYear() + ":" + today.getMonth() + ":" + today.getDay() + " - " + today.getUTCHours() + ":" + today.getUTCMinutes() + ":" + today.getUTCSeconds() );
    // today_secs - 5; // If rfid signal is older than 5 seconds than delete it
    await Rfid.deleteMany({ stamp_secs: { $lt: today_secs } }, function (err, response) {
        if (err) console.log(err);
        console.log(response);
    });
});
/**
 * Start Agenda repeat on specified human time interval
 */
async function startAgenda() {
    await agenda.start();
    await agenda.every('1 hours', 'rfid_delete');
}

async function graceful() {
    await agenda.stop();
    process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);


module.exports = { startAgenda };