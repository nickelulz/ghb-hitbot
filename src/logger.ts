import log4js from 'log4js'

const config = {
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd] [hh:mm:ss}] %[[%p] %m%]'
      }
    },
    file: {
        type: 'file',
        layout: {
            type: 'pattern',
            pattern: '[%d{yyyy-MM-dd] [hh:mm:ss}] [%p] %m'
        }
    }
  },
  categories: { default: { appenders: ['out'], level: 'info' } }
};

log4js.configure(config);
const logger = log4js.getLogger();
export default logger;