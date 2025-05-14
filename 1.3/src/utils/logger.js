const chalk = require('chalk');

class Logger {
  constructor() {
    this.verbose = false;
  }

  setVerbose(value) {
    this.verbose = value;
  }

  info(message) {
    console.log(chalk.cyan('[INFO]'), message);
  }

  warn(message) {
    console.warn(chalk.yellow('[WARN]'), message);
  }

  error(message) {
    console.error(chalk.red('[ERROR]'), message);
  }

  debug(message) {
    if (this.verbose) {
      console.log(chalk.gray('[DEBUG]'), message);
    }
  }
}

module.exports = new Logger();
