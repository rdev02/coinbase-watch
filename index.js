require('./app/cronjobs.service')
const port =  process.env.CBW_PORT || 3000;
const helmet = require("helmet");
const express = require("express");

const checker = require('./app/checker.service');
const state = require('./app/storedstate');
const logger = require("./app/logger.service");
const app = express();

app.use(require('morgan')({ "stream": logger.stream }));
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
//app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.get('/min', (req, res) => {
    res.jsonp(state.state.min);
});

app.put('/min/:newPrice', (req, res) => {
    const newPrice = Number(req.params.newPrice);
    if(!isNaN(newPrice) && newPrice > 0){
        state.state.min = newPrice;
        state.reset();
        const msg = `min price set to $${newPrice}`;
        logger.info(msg);
        res.send(msg);
    } else {
        res.sendStatus(400);
    }
});

app.get('/max', (req, res) => {
    res.jsonp(state.state.max);
});

app.put('/max/:newPrice', (req, res) => {
    const newPrice = Number(req.params.newPrice);
    if(!isNaN(newPrice) && newPrice > 0){
        state.state.max = newPrice;
        state.reset();
        const msg =`max price set to $${newPrice}`;
        logger.info(msg);
        res.send(msg);
    } else {
        res.sendStatus(400);
    }
});

app.get('/checkAndSend', (req, res) => {
    checker.checkAndNotify()
        .catch(err => res.send(err))
        .then(() => res.send('Complete'));
});

app.listen(port, () => {
    logger.info(`App listening at port ${port}`);
})





