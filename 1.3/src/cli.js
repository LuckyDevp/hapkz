#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const logger = require('./utils/logger');
const pythonConverter = require('./converters/pythonConverter');
const cppConverter = require('./converters/cppConverter');
const csharpConverter = require('./converters/csharpConverter');

const program = new Command();

program
  .name('hapksz')
  .description('Advanced converter for Python, C++, and C# to real .exe executables')
  .version('1.3.0');

program
  .command('python <inputFile>')
  .description('Convert a Python file to a real executable')
  .option('-o, --output <outputExe>', 'Output executable filename', 'output.exe')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (inputFile, options) => {
    try {
      logger.setVerbose(!!options.verbose);
      logger.info(chalk.blue(`Starting Python conversion: ${inputFile} -> ${options.output}`));
      await pythonConverter.convert(inputFile, options.output);
      logger.info(chalk.green('Python conversion completed successfully.'));
    } catch (error) {
      logger.error(chalk.red(`Python conversion error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('cpp <inputFile>')
  .description('Convert a C++ file to a real executable')
  .option('-o, --output <outputExe>', 'Output executable filename', 'output.exe')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (inputFile, options) => {
    try {
      logger.setVerbose(!!options.verbose);
      logger.info(chalk.blue(`Starting C++ conversion: ${inputFile} -> ${options.output}`));
      await cppConverter.convert(inputFile, options.output);
      logger.info(chalk.green('C++ conversion completed successfully.'));
    } catch (error) {
      logger.error(chalk.red(`C++ conversion error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('csharp <inputFile>')
  .description('Convert a C# file to a real executable')
  .option('-o, --output <outputExe>', 'Output executable filename', 'output.exe')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (inputFile, options) => {
    try {
      logger.setVerbose(!!options.verbose);
      logger.info(chalk.blue(`Starting C# conversion: ${inputFile} -> ${options.output}`));
      await csharpConverter.convert(inputFile, options.output);
      logger.info(chalk.green('C# conversion completed successfully.'));
    } catch (error) {
      logger.error(chalk.red(`C# conversion error: ${error.message}`));
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
