const fs = require('fs');
const vm = require('vm');

function include(path) {
  const code = fs.readFileSync(path, 'utf-8');
  vm.runInThisContext(code, path);
}

module.exports = { include };
