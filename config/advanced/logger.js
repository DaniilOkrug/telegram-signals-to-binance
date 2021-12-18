const appRoot = require('app-root-path');
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'your-service-name' },
    transports: [
        new transports.File({ filename: `${appRoot}/logs/error.log`, level: 'error' }),
        new transports.File({ filename: `${appRoot}/logs/combined.log` })
    ]
});

module.exports = {
    logger
}