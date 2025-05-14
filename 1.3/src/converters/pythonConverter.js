const fs = require('fs/promises');
const path = require('path');
const { runCommand } = require('../utils/processRunner');
const logger = require('../utils/logger');
const { removeComments } = require('../preprocessors/commentRemover');

const ICON_PATH = path.resolve(__dirname, '../../assets/hapksz_icon.ico');
const TEMP_DIR = path.resolve(__dirname, '../../temp_py');

/**
 * Converts a Python file to a standalone .exe using PyInstaller.
 * Cleans comments, writes temp file, runs PyInstaller with icon and onefile options.
 * @param {string} inputFile - Path to the Python source file.
 * @param {string} outputExe - Desired output executable filename.
 */
async function convert(inputFile, outputExe) {
  if (!inputFile.endsWith('.py')) {
    throw new Error('Input file must have .py extension');
  }

  logger.info('Reading and cleaning Python source code...');
  const absInput = path.resolve(inputFile);
  const absTempDir = TEMP_DIR;
  const tempCleanFile = path.join(absTempDir, 'cleaned.py');

  await fs.mkdir(absTempDir, { recursive: true });
  let code = await fs.readFile(absInput, 'utf8');
  code = removeComments(code);
  await fs.writeFile(tempCleanFile, code, 'utf8');

  const exeName = outputExe.endsWith('.exe') ? outputExe.slice(0, -4) : outputExe;

  logger.info(`Running PyInstaller to build executable: ${outputExe}`);

  // Build PyInstaller args
  // --onefile: single executable
  // --noconsole: hides console window (optional, remove if console needed)
  // --icon: use custom icon
  // --clean: clean previous builds
  const args = [
    '--onefile',
    '--noconsole',
    `--icon=${ICON_PATH}`,
    `--name=${exeName}`,
    '--clean',
    tempCleanFile
  ];

  try {
    await runCommand('pyinstaller', args);

    const distExe = path.resolve('dist', `${exeName}.exe`);
    const finalExe = path.resolve(outputExe);

    // Move executable to desired location
    await fs.rename(distExe, finalExe);

    // Clean up build artifacts
    await fs.rm(absTempDir, { recursive: true, force: true });
    await fs.rm('build', { recursive: true, force: true });
    await fs.rm(`${exeName}.spec`, { force: true });

    logger.info(`Python executable generated at: ${finalExe}`);
  } catch (error) {
    throw new Error(`PyInstaller failed: ${error.message}`);
  }
}

module.exports = { convert };
