const cron = require('node-cron');

const checker = require('./checker.service');
const logger = require('./logger.service');
const state = require('./storedstate');

// every 30 minutes
const checkSchedule = process.env.CBW_CHECK_SCHEDULE || '30 * * * *';

/*
# ┌────────────── second (optional)
# │ ┌──────────── minute
# │ │ ┌────────── hour
# │ │ │ ┌──────── day of month
# │ │ │ │ ┌────── month
# │ │ │ │ │ ┌──── day of week
# │ │ │ │ │ │
# │ │ │ │ │ │
# * * * * * *
*/

// clean notification every day
cron.schedule('0 0 * * *', () => {
    // keep counters in case they trend over midnight
    if(state.state.notificationSent) {
        state.reset();
    }
});

cron.schedule(checkSchedule, () => {
    checker.checkAndNotify()
        .catch(err => logger.error(err))
        .then(() => logger.debug('checkAndNotify complete'));
});