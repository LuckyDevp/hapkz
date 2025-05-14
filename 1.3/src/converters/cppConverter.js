const fs = require('fs/promises');
const path = require('path');
const { runCommand } = require('../utils/processRunner');
const logger = require('../utils/logger');
const { removeComments } = require('../preprocessors/commentRemover');

const TEMP_DIR = path.resolve(__dirname, '../../temp_cpp');
const ICON_PATH = path.resolve(__dirname, '../../assets/hapksz_icon.ico');

/**
 * Converts a C++ source file to a standalone .exe using a native compiler.
 * Cleans comments, writes temp file, compiles statically, applies icon.
 * Requires installed g++ (MinGW) or cl.exe (Visual Studio).
 * @param {string} inputFile - Path to the C++ source file.
 * @param {string} outputExe - Desired output executable filename.
 */
async function convert(inputFile, outputExe) {
  if (!inputFile.endsWith('.cpp')) {
    throw new Error('Input file must have .cpp extension');
  }

  logger.info('Reading and cleaning C++ source code...');
  const absInput = path.resolve(inputFile);
  const absTempDir = TEMP_DIR;
  const tempCleanFile = path.join(absTempDir, 'cleaned.cpp');

  await fs.mkdir(absTempDir, { recursive: true });
  let code = await fs.readFile(absInput, 'utf8');
  code = removeComments(code);
  await fs.writeFile(tempCleanFile, code, 'utf8');

  const absOutputExe = path.resolve(outputExe);

  // Detect compiler to use (prefer g++)
  // You can extend this to detect cl.exe or others
  const compiler = 'g++';

  // Compile args:
  // -static for static linking (no external dll dependencies)
  // -o output file
  // -Wall for warnings
  // -O2 optimization
  // -mwindows to suppress console window (optional)
  // Icon embedding requires external tool (rcedit), handled after compilation
  const compileArgs = [
    '-static',
    '-O2',
    '-Wall',
    tempCleanFile,
    '-o',
    absOutputExe
  ];

  logger.info(`Compiling C++ source to executable: ${outputExe}`);

  try {
    await runCommand(compiler, compileArgs);

    logger.info('Applying icon to executable...');
    // Apply icon with rcedit (must be installed and in PATH)
    // Example: rcedit.exe output.exe --set-icon hapksz_icon.ico
    await runCommand('rcedit', [absOutputExe, '--set-icon', ICON_PATH]);

    // Clean temp files
    await fs.rm(absTempDir, { recursive: true, force: true });

    logger.info(`C++ executable generated at: ${absOutputExe}`);
  } catch (error) {
    throw new Error(`C++ compilation failed: ${error.message}`);
  }
}

module.exports = { convert };
