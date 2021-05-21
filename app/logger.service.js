const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.File({
            level: process.env.CBW_LOG_LEVEL || 'info',
            filename: './logs/all-logs.log',
            handleExceptions: true,
            maxsize: 52428800, //50MB
            maxFiles: 5,
            colorize: false
        }),
        new transports.Console({
            level: process.env.CBW_LOG_LEVEL || 'info',
            handleExceptions: true,
            colorize: true
        })
    ],
    exitOnError: false
})

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
