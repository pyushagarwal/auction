// copied from winston docs
const winston = require('winston');
const format = winston.format
let logger;
const intializeLogger = function(appName){
    logger = winston.createLogger({
        level: 'info',
        format: format.combine(
            format.errors({ stack: true }), // <-- use errors format
            format.colorize(),
            format.timestamp(),
            format.printf((info) => {
                if (info.stack) {
                    return `${info.timestamp} ${appName} ${info.level}: ${info.message}: ${info.stack}`
                } else {
                    return `${info.timestamp} ${appName} ${info.level}: ${info.message}`
                }
                
            }),
        ),
        transports: [
            new winston.transports.Console({
                level: 'info', colorize: true }),
        ],
    });
    return logger;
}
const getLogger = function(){
    if (!logger){
        throw("logger now intilized");
    }
    return logger;
}

module.exports = {
    getLogger : getLogger,
    intializeLogger : intializeLogger
}
