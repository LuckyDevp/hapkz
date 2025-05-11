const { execSync } = require('child_process');

function compileJS(inputFile, outputFile) {
  execSync(`pkg ${inputFile} --target=win --output ${outputFile}`, { stdio: 'inherit' });
  console.log(`[SUCCESS] ${outputFile} generated!`);
}

module.exports = { compileJS };