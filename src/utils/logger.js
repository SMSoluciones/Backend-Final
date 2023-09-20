import winston from "winston";
import config from "../config/config.js";

const ENVIRONMENT = config.enviroment;

const myLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warn: "yellow",
    info: "green",
    http: "blue",
    debug: "blue",
  },
};

let logger;

if (ENVIRONMENT === "production") {
  logger = winston.createLogger({
    levels: myLevels.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
            colors: myLevels.colors,
          }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "logs/errors.log",
        level: "error",
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    levels: myLevels.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
            colors: myLevels.colors,
          }),
          winston.format.simple()
        ),
      }),
    ],
  });
}

const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.info(`${req.method} - ${req.url} - ${new Date().toISOString()}`);
  next();
};

const getLogger = () => {
  return logger;
};

export { addLogger, getLogger };
