#!/usr/bin/env node
const { Command } = require('commander');
const { compilePython } = require('./python-compiler');
const { compileJS } = require('./js-compiler');
const { compileCPP } = require('./cpp-compiler');
const { removeComments } = require('./utils');

const program = new Command();

program
  .name('hapksz')
  .description('CLI tool to convert Python, JS, and C++ to .exe')
  .version('1.0.0');

// Comando para Python
program
  .command('compile <inputFile>')
  .description('Compile Python to .exe')
  .option('--convert <outputFile>', 'Output .exe name')
  .option('--onefile', 'Single executable')
  .option('--micro', 'Optimize for size')
  .action((inputFile, options) => {
    removeComments(inputFile, 'python');
    compilePython(inputFile, options.convert, options.onefile, options.micro);
  });

// Comando para JavaScript
program
  .command('compile <inputFile>')
  .description('Compile JavaScript to .exe')
  .option('--exez <outputFile>', 'Output .exe name')
  .action((inputFile, options) => {
    removeComments(inputFile, 'javascript');
    compileJS(inputFile, options.exe);
  });

// Comando para C++
program
  .command('compile <inputFile>')
  .description('Compile C++ to .exe')
  .option('--usecpp <outputFile>', 'Output .exe name')
  .action((inputFile, options) => {
    removeComments(inputFile, 'cpp');
    compileCPP(inputFile, options.usecpp);
  });

program.parse(process.argv);