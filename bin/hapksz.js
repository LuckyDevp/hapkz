#!/usr/bin/env node
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const args = process.argv.slice(2)

if (args.length < 3) {
  console.log('Usage:')
  console.log('hapkz file.py --onefilesx file.exe')
  console.log('hapks file.cpp --oxpp file.exe')
  console.log('hapksz file.cs --convertx file.exe')
  process.exit(1)
}

const [sourceFile, flag, outputFile] = args
const ext = path.extname(sourceFile).toLowerCase()

if (!fs.existsSync(sourceFile)) {
  console.error('Source file not found')
  process.exit(1)
}

const outputPath = path.join(path.dirname(sourceFile), outputFile)

function runCommand(command, params, callback) {
  const proc = spawn(command, params, { stdio: 'inherit' })
  proc.on('close', code => {
    if (code === 0) callback(null)
    else callback(new Error(`${command} exited with code ${code}`))
  })
}

if (ext === '.py' && flag === '--onefilesx') {
  // Compile Python: create executable using embedded Python or pyinstaller alternative
  // Here we assume python is installed and use pyinstaller if allowed
  // Since you want no external libs, we can just package with pyinstaller if allowed
  // Or just create a .bat launcher (simplified)
  console.log('Python compilation not implemented without external tools')
  process.exit(1)
} else if (ext === '.cpp' && flag === '--oxpp') {
  // Compile C++
  runCommand('cl.exe', [sourceFile, '/Fe:' + outputPath], err => {
    if (err) {
      console.error('C++ compilation failed:', err.message)
      process.exit(1)
    } else {
      console.log('C++ executable created at', outputPath)
    }
  })
} else if ((ext === '.cs' || ext === '.c') && flag === '--convertx') {
  // Compile C#
  runCommand('csc.exe', ['/out:' + outputPath, sourceFile], err => {
    if (err) {
      console.error('C# compilation failed:', err.message)
      process.exit(1)
    } else {
      console.log('C# executable created at', outputPath)
    }
  })
} else {
  console.error('Invalid command or file extension')
  process.exit(1)
}
