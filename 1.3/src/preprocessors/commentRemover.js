/**
 * Removes comments from code string.
 * Supports:
 * - Single-line comments: // ... (C++, C#, JS)
 * - Single-line comments: # ... (Python)
 * - Multi-line comments: /* ... *\/
 * 
 * @param {string} code - Source code string
 * @returns {string} - Code without comments
 */
function removeComments(code) {
  // Remove multi-line comments (/* ... */)
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove single-line comments starting with //
  code = code.replace(/\/\/.*$/gm, '');

  // Remove single-line comments starting with # (Python)
  code = code.replace(/^\s*#.*$/gm, '');

  // Trim trailing whitespace on each line
  code = code.split('\n').map(line => line.trimEnd()).join('\n');

  // Remove empty lines caused by comment removal (optional)
  code = code.replace(/^\s*[\r\n]/gm, '');

  return code.trim();
}

module.exports = { removeComments };
