// copied from winston docs
const winston = require('winston');
const format = winston.format
const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.errors({ stack: true }), // <-- use errors format
        format.colorize(),
        format.timestamp(),
        format.printf((info) => {
            if (info.stack) {
                return `${info.timestamp} ${info.level}: ${info.message}: ${info.stack}`
            } else {
                return `${info.timestamp} ${info.level}: ${info.message}`
            }
            
        }),
    ),
    transports: [
        new winston.transports.Console({
            level: 'info', colorize: true }),
    ],
});
module.exports = logger
