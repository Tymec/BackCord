const config = require('../config/config.json');
const consoleLogger = require('pino')({
    prettyPrint: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname,filename',
        messageFormat: '{filename}: {msg}'
    }
});
const fileLogger = require('pino')(config.logPath);

module.exports = {
    console: consoleLogger,
    file: fileLogger,

    fatal(msg, args=[]) {
        this.console.fatal(msg, args);
        this.file.fatal(msg, args);
    },
    error(msg, args=[]) {
        this.console.error(msg, args);
        this.file.error(msg, args);
    },
    warn(msg, args=[]) {
        this.console.warn(msg, args);
        this.file.warn(msg, args);
    },
    info(msg, args=[]) {
        this.console.info(msg, args);
        this.file.info(msg, args);
    },
    debug(msg, args=[]) {
        this.console.debug(msg, args);
        this.file.debug(msg, args);
    },
    trace(msg, args=[]) {
        this.console.trace(msg, args);
        this.file.trace(msg, args);
    },
    silent(msg, args=[]) {
        this.console.silent(msg, args);
        this.file.silent(msg, args);
    }
};
