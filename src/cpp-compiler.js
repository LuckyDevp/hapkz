const { execSync } = require('child_process');

function compileCPP(inputFile, outputFile) {
  execSync(`g++ ${inputFile} -o ${outputFile}`, { stdio: 'inherit' });
  console.log(`[SUCCESS] ${outputFile} generated!`);
}

module.exports = { compileCPP };