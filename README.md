# coinbase-watch
Watches coinbase for you at cron interval and sends you notifications via sms. Requires twilio account.
Has a small REST API to configure min/max thresholds and run a check manually. 
Avoids spamming by making sure price stays below/above target for 3 periods, or 3 checks daily.
Sends at most 1 sms per day.

# usage
`docker build -t local/cbw:1.0 .`

use below docker-compose to run.

## example docker-compose
```
version: "3"

services:
    cbw:
        image: local/cbw:1.0
        restart: unless-stopped
        environment:
            CBW_NOTIFY_PHONE: "your_num_here"
            CBW_TWILIO_PHONE: "your_num_here"
            CBW_TWILIO_ACCOUNT_SID: "your_sid_here"
            CBW_TWILIO_AUTH_TOKEN: "your_auth_here"
            CBW_CHECK_SCHEDULE: "your_cron_here"
        ports: 
             - "3000:3000"
```
## Env vars

* `CBW_NOTIFY_PHONE` - mandatory. the phone to send sms to
* `CBW_TWILIO_PHONE` - mandatory. the twillio assigned phone no
* `CBW_TWILIO_ACCOUNT_SID` - mandatory. your twillio creds
* `CBW_TWILIO_AUTH_TOKEN` - mandatory. your twillio creds
* `CBW_CHECK_SCHEDULE`, default `30 * * * *` - each hour at 30m
* `CBW_LOG_LEVEL` - default `info`
* `CBW_PORT` - default `3000`
* `CBW_MIN_CHECKS` - default `3`
* `CBW_COIN_PAIR` - default `ETH-USD`. the coin-fiat to watch