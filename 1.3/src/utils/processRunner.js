const { spawn } = require('child_process');
const logger = require('./logger');

/**
 * Runs an external command with arguments, logs output and errors in real-time.
 * Returns a Promise that resolves on success or rejects on failure.
 * 
 * @param {string} command Command to run
 * @param {string[]} args Arguments array
 * @param {object} options Spawn options (cwd, env, etc.)
 * @returns {Promise<void>}
 */
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    logger.debug(`Executing command: ${command} ${args.join(' ')}`);

    const proc = spawn(command, args, { shell: true, ...options });

    proc.stdout.on('data', (data) => {
      logger.info(data.toString().trim());
    });

    proc.stderr.on('data', (data) => {
      logger.warn(data.toString().trim());
    });

    proc.on('error', (err) => {
      logger.error(`Command execution error: ${err.message}`);
      reject(err);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        logger.debug('Command finished successfully.');
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });
  });
}

module.exports = { runCommand };
