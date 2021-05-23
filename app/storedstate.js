const logger = require("./logger.service");

const _state = {
    coinPair: process.env.CBW_COIN_PAIR || 'ETH-USD',
    notificationSent: false,
    min: process.env.CBW_COIN_MIN_PRICE || 2000,
    max: process.env.CBW_COIN_MAX_PRICE || 4000,
    stopLoss: process.env.CBW_COIN_STOP_LOSS || 1000,
    checksToNotify: process.env.CBW_MIN_CHECKS || 3,
    currentMinChecks: 0,
    currentMaxChecks: 0
}

module.exports.reset = () => {
    _state.notificationSent = false;
    _state.currentMinChecks = 0;
    _state.currentMaxChecks = 0;
    logger.info('state reset');
}

module.exports.state = _state;