import log4js from 'log4js'
import { DEBUG_MODE } from './constants';

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
        file: 'logs/',
        layout: {
            type: 'pattern',
            pattern: '[%d{yyyy-MM-dd] [hh:mm:ss}] [%p] %m'
        }
    }
  },
  categories: { default: { appenders: ['out'], level: 'all' } }
};

config.appenders.file.file += new Date().toDateString();
log4js.configure(config);
const logger = log4js.getLogger();
export default logger;