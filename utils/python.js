const { spawn } = require('child_process')
const path = require('path')

function compilePython(sourceFile, outputFile, callback) {
  const args = ['-m', 'py_compile', sourceFile]
  const proc = spawn('python', args, { stdio: 'inherit' })

  proc.on('close', code => {
    if (code === 0) {
      callback(null)
    } else {
      callback(new Error('Python compilation failed'))
    }
  })
}

module.exports = { compilePython }
