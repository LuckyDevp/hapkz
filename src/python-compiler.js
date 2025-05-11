const { execSync } = require('child_process');
const path = require('path');

function compilePython(inputFile, outputFile, onefile, micro) {
  const args = [
    'pyinstaller',
    onefile ? '--onefile' : '',
    micro ? '--strip --noupx' : '',
    `--icon=${path.resolve('src/icons/python.ico')}`,
    `--name=${outputFile.replace('.exe', '')}`,
    inputFile
  ].filter(Boolean).join(' ');

  execSync(args, { stdio: 'inherit' });
  console.log(`[SUCCESS] ${outputFile} generated in dist/`);
}

module.exports = { compilePython };