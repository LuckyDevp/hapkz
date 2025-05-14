const path = require('path');

module.exports = {
  iconPath: path.resolve(__dirname, '../assets/hapksz_icon.ico'),
  tempDirs: {
    python: path.resolve(__dirname, '../temp_py'),
    cpp: path.resolve(__dirname, '../temp_cpp'),
    csharp: path.resolve(__dirname, '../temp_csharp')
  },
  distDir: path.resolve(__dirname, '../dist'),
  defaultOutputName: 'output.exe',
  // Add more global config options here as needed
};
