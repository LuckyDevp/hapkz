const { spawn } = require('child_process')

function compileCpp(sourceFile, outputFile, callback) {
  const args = [sourceFile, '/Fe:' + outputFile]
  const proc = spawn('cl.exe', args, { stdio: 'inherit' })

  proc.on('close', code => {
    if (code === 0) callback(null)
    else callback(new Error('C++ compilation failed'))
  })
}

module.exports = { compileCpp }
