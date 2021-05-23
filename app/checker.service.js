const bent = require('bent');
const getJSON = bent('json');
const logger = require('./logger.service');

const state = require('./storedstate').state;
const notifyPhoneNo = process.env.CBW_NOTIFY_PHONE;
const twilioPhoneNo = process.env.CBW_TWILIO_PHONE;
const accountSid = process.env.CBW_TWILIO_ACCOUNT_SID;
const authToken = process.env.CBW_TWILIO_AUTH_TOKEN;

const twilio = require('twilio')(accountSid, authToken);

function sendSMS(text, price) {
    return twilio.messages.create({
        to: notifyPhoneNo,
        from: twilioPhoneNo,
        body: text
            .replace('{PAIR}', state.coinPair)
            .replace('{PRICE}', price)
    });
}

module.exports.checkAndNotify = async () => {
    if(state.notificationSent) {
        logger.debug('notification sent for the day')
        return;
    }

    logger.debug('getting buy price');
    let buyPriceObj = await getJSON('https://api.coinbase.com/v2/prices/{PAIR}/buy'.replace('{PAIR}', state.coinPair));
    logger.debug('getting sell price');
    let sellPriceObj = await getJSON('https://api.coinbase.com/v2/prices/{PAIR}/sell'.replace('{PAIR}', state.coinPair));

    const buyPrice = buyPriceObj.data.amount;
    const sellPrice = sellPriceObj.data.amount;

    logger.debug('buy: ' + buyPrice + ' sell: ' + sellPrice);
    if(buyPrice <= state.min) {
        state.currentMinChecks += 1;
        if(state.currentMinChecks < state.checksToNotify) {
            logger.debug('price below ' + state.min + ' ' + state.currentMinChecks + ' time(s)');
            return ;
        }

        logger.info('send sms for buy event: price below $' + buyPrice);
        await sendSMS('{PAIR} price below ${PRICE}. Consider buying.', buyPrice);
        state.notificationSent = true;
    } else if (sellPrice <= state.stopLoss) {
        logger.info('send sms for stop loss event: price below $' + sellPrice);
        await sendSMS('{PAIR} price blow ${PRICE}. Time to cut losses.', sellPrice);
        state.notificationSent = true;
    } else if (sellPrice >= state.max) {
        state.currentMaxChecks += 1;
        if(state.currentMaxChecks < state.checksToNotify) {
            logger.debug(`price above ${state.max} ${state.currentMaxChecks} time(s)`);
            return;
        }

        logger.info('send sms for sell event: price above $' + sellPrice);
        await sendSMS('{PAIR} price above ${PRICE}. Consider selling.', sellPrice);
        state.notificationSent = true;
    } else {
        logger.debug(`prices outside of range[${state.min}, ${state.max}]. waiting...`);
    }
};
