const { spawn } = require('child_process')

function compileCSharp(sourceFile, outputFile, callback) {
  const args = ['/out:' + outputFile, sourceFile]
  const proc = spawn('csc.exe', args, { stdio: 'inherit' })

  proc.on('close', code => {
    if (code === 0) callback(null)
    else callback(new Error('C# compilation failed'))
  })
}

module.exports = { compileCSharp }
