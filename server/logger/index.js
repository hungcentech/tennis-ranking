// -----------------------------------------------------------------------------

import config from "../config";

// -----------------------------------------------------------------------------

const pad = require("pad");
require("winston-daily-rotate-file");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const myFormat = printf(info => {
  return `${info.timestamp} | ${pad(info.level, 5)} | ${info.message}`;
});

// -----------------------------------------------------------------------------

export default createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    myFormat
  ),
  transports: [
    new transports.DailyRotateFile({
      name: "debug-file",
      level: config.logger.file.level,
      filename: config.logger.file.path,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true
    }),
    new transports.Console({
      name: "console",
      level: config.logger.console.level
    })
  ],
  exitOnError: false
});

// -----------------------------------------------------------------------------
