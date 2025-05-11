const fs = require('fs');
const { execSync } = require('child_process');

function removeComments(filePath, language) {
  let code = fs.readFileSync(filePath, 'utf-8');
  let cleanedCode;

  switch (language) {
    case 'python':
      cleanedCode = code.replace(/#.*$/gm, '');
      break;
    case 'javascript':
      cleanedCode = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
      break;
    case 'cpp':
      cleanedCode = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
      break;
    default:
      cleanedCode = code;
  }

  fs.writeFileSync(filePath, cleanedCode);
  return cleanedCode;
}

function checkDependencies() {
  try {
    execSync('pyinstaller --version');
    execSync('pkg --version');
    execSync('g++ --version');
  } catch (error) {
    console.error('Error: Required tools not installed (PyInstaller, pkg, g++)');
    process.exit(1);
  }
}

module.exports = { removeComments, checkDependencies };